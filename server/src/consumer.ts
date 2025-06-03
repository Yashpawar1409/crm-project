import express from "express";
import amqp from "amqplib";
import mongoose from "mongoose";
import CommunicationLog from "./model/campaign-shema"; // Update path if needed
import { Connection } from "./database/db"; // Update path if needed

interface Customer {
  custName: string;
  custEmail: string;
}

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ||
  "amqps://clvzyewb:xHffTKYN9R1h-0ZIsGFjrQqwRF_rG2g3@possum.lmq.cloudamqp.com/clvzyewb";
const EXCHANGE = "campaignExchange";

Connection(); // Connect to MongoDB

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, "fanout", { durable: false });

    const queue = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(queue.queue, EXCHANGE, "");

    console.log(`✅ Consumer connected and listening on queue: ${queue.queue}`);

    channel.consume(
      queue.queue,
      async (msg) => {
        if (msg) {
          try {
            const customer: Customer = JSON.parse(msg.content.toString());

            // Simulate message delivery (you can replace with real logic)
            const isSuccess = Math.random() > 0.2; // 80% success rate
            const status = isSuccess ? "SENT" : "FAILED";

            // Save to MongoDB
            const log = new CommunicationLog({
              custName: customer.custName,
              custEmail: customer.custEmail,
              status,
              timestamp: new Date(), // ensure date is saved
            });

            await log.save();

            console.log(`📩 Processed ${customer.custName} → ${status}`);
            channel.ack(msg); // Acknowledge success
          } catch (err) {
            console.error("❌ Error processing message:", err);
            channel.ack(msg); // Still acknowledge to prevent re-delivery
          }
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("❌ Failed to connect to RabbitMQ:", err);
  }
}

connectRabbitMQ();
