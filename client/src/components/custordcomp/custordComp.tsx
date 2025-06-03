"use client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const CustOrdComponent = () => {
  const router = useRouter();
  const params = useParams<{ shopname: string }>();
  const shopName = decodeURIComponent(params.shopname);

  // -------------customerState--------------//
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [spends, setSpends] = useState("");
  const [visits, setVisit] = useState("");
  const [lastVisits, setLastVisit] = useState("");

  // -------------orderState--------------//
  const [orderName, setOrderName] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [orderDate, setOrderDate] = useState("");

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const customerData = {
      custName,
      custEmail,
      spends,
      visits,
      lastVisits,
      shopName,
    };
    try {
      const response = await fetch("http://localhost:8000/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });
      if (response.ok) {
        alert("Customer submitted");
        router.push(`${shopName}/${localStorage.getItem("email")}/campaign`);
      }
    } catch (error) {
      console.error("Error submitting customer", error);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderData = { orderName, orderEmail, amount, orderDate, shopName };
    try {
      const response = await fetch("http://localhost:8000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        alert("Order submitted");
        window.location.reload();
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Order Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 m-auto cursor-pointer">
            <Button variant="outline" className="text-black hover:opacity-75">
              +Order
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleOrderSubmit}>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Add details of the order.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="orderName">Name</Label>
                <Input
                  id="orderName"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  placeholder="Order Name"
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="orderEmail">Email</Label>
                <Input
                  id="orderEmail"
                  value={orderEmail}
                  onChange={(e) => setOrderEmail(e.target.value)}
                  className="text-black"
                  type="email"
                  placeholder="Order Email"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-black"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="orderDate">Date</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="text-black"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-white text-black hover:opacity-70">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 m-auto cursor-pointer">
            <Button variant="outline" className="text-black hover:opacity-75">
              +Customer
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCustomerSubmit}>
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>Add details of the customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="custName">Name</Label>
                <Input
                  id="custName"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Customer Name"
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="custEmail">Email</Label>
                <Input
                  id="custEmail"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="text-black"
                  type="email"
                  placeholder="Customer Email"
                />
              </div>
              <div>
                <Label htmlFor="spends">Total Amount Spent</Label>
                <Input
                  id="spends"
                  value={spends}
                  onChange={(e) => setSpends(e.target.value)}
                  className="text-black"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="visits">Visits</Label>
                <Input
                  id="visits"
                  value={visits}
                  onChange={(e) => setVisit(e.target.value)}
                  className="text-black"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="lastVisits">Last Visit</Label>
                <Input
                  id="lastVisits"
                  type="date"
                  value={lastVisits}
                  onChange={(e) => setLastVisit(e.target.value)}
                  className="text-black"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-white text-black hover:opacity-70">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustOrdComponent;
