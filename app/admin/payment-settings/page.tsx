"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Edit, Check, X, AlertCircle, CheckCircle } from "lucide-react";

type PaymentInfo = {
  id: string;
  type: string;
  upiId: string;
  merchantName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function PaymentSettingsPage() {
  const [paymentInfoList, setPaymentInfoList] = useState<PaymentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [newUpiId, setNewUpiId] = useState("");
  const [newMerchantName, setNewMerchantName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editId, setEditId] = useState<string | null>(null);
  const [editUpiId, setEditUpiId] = useState("");
  const [editMerchantName, setEditMerchantName] = useState("");

  // Fetch payment info list
  const fetchPaymentInfoList = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/admin/payment-info");
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentInfoList(data.paymentInfoList);
      } else {
        setError(data.message || "Failed to fetch payment information");
      }
    } catch (err) {
      setError("An error occurred while fetching payment information");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentInfoList();
  }, []);

  // Add new payment info
  const handleAddPaymentInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch("/api/admin/payment-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          upiId: newUpiId,
          merchantName: newMerchantName,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("UPI payment information added successfully");
        setNewUpiId("");
        setNewMerchantName("");
        setIsAdding(false);
        fetchPaymentInfoList();
      } else {
        setError(data.message || "Failed to add UPI payment information");
      }
    } catch (err) {
      setError("An error occurred while adding UPI payment information");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing payment info
  const handleStartEdit = (paymentInfo: PaymentInfo) => {
    setEditId(paymentInfo.id);
    setEditUpiId(paymentInfo.upiId);
    setEditMerchantName(paymentInfo.merchantName);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditId(null);
    setEditUpiId("");
    setEditMerchantName("");
  };

  // Update payment info
  const handleUpdatePaymentInfo = async (id: string) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch("/api/admin/payment-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          upiId: editUpiId,
          merchantName: editMerchantName,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("UPI payment information updated successfully");
        setEditId(null);
        fetchPaymentInfoList();
      } else {
        setError(data.message || "Failed to update UPI payment information");
      }
    } catch (err) {
      setError("An error occurred while updating UPI payment information");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle payment info active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch("/api/admin/payment-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          isActive: !currentStatus,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`UPI payment information ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchPaymentInfoList();
      } else {
        setError(data.message || "Failed to update UPI payment information status");
      }
    } catch (err) {
      setError("An error occurred while updating UPI payment information status");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">UPI Payment Settings</h1>
      
      {/* Alert messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}
      
      {/* Add new payment info button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add New UPI ID</span>
        </button>
      )}
      
      {/* Add new payment info form */}
      {isAdding && (
        <div className="bg-background/80 backdrop-blur-lg rounded-xl border p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Add New UPI ID</h2>
          <form onSubmit={handleAddPaymentInfo} className="space-y-4 flex flex-col">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                UPI ID
              </label>
              <input
                type="text"
                value={newUpiId}
                onChange={(e) => setNewUpiId(e.target.value)}
                className="w-full bg-background border rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. example@upi"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Merchant Name
              </label>
              <input
                type="text"
                value={newMerchantName}
                onChange={(e) => setNewMerchantName(e.target.value)}
                className="w-full bg-background border rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. Company Name"
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add UPI ID"}
              </button>
              
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Payment info list */}
      <div className="bg-background/80 backdrop-blur-lg rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">UPI ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">Merchant Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Loading payment information...
                </td>
              </tr>
            ) : paymentInfoList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No UPI payment information found. Add one to get started.
                </td>
              </tr>
            ) : (
              paymentInfoList.map((paymentInfo) => (
                <tr key={paymentInfo.id}>
                  <td className="px-4 py-4">
                    {editId === paymentInfo.id ? (
                      <input
                        type="text"
                        value={editUpiId}
                        onChange={(e) => setEditUpiId(e.target.value)}
                        className="w-full bg-background border rounded-lg py-1 px-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    ) : (
                      paymentInfo.upiId
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {editId === paymentInfo.id ? (
                      <input
                        type="text"
                        value={editMerchantName}
                        onChange={(e) => setEditMerchantName(e.target.value)}
                        className="w-full bg-background border rounded-lg py-1 px-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    ) : (
                      paymentInfo.merchantName
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        paymentInfo.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {paymentInfo.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right space-x-2">
                    {editId === paymentInfo.id ? (
                      <>
                        <button
                          onClick={() => handleUpdatePaymentInfo(paymentInfo.id)}
                          disabled={isSubmitting}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Save"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Cancel"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(paymentInfo)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(paymentInfo.id, paymentInfo.isActive)}
                          disabled={isSubmitting}
                          className={`p-1 ${
                            paymentInfo.isActive
                              ? "text-gray-600 hover:text-gray-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                          title={paymentInfo.isActive ? "Deactivate" : "Activate"}
                        >
                          {paymentInfo.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 