"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit, X, Lock, Banknote, Users } from "lucide-react";

export default function AccountSetting() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample user data - replace with actual data from your auth provider
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    username: "johndoe",
    gender: "Male",
    mobile: "+1 234 567 890",
    aadhar: "1234 5678 9012",
    dob: "1990-01-01",
    address: "123 Trade Street",
    bankName: "Global Forex Bank",
    accountHolder: "John Doe",
    accountNumber: "**** **** 1234",
    ifsc: "GLB0000123",
    pan: "ABCDE1234F",
    nomineeName: "Jane Doe",
    nomineeRelation: "Spouse",
    nomineeDob: "1992-05-15"
  });

  const [formData, setFormData] = useState({ ...userData });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) setFormData({ ...userData });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setUserData({ ...formData });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Account Settings</h1>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </h2>
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Aadhar Number</label>
                <input
                  type="text"
                  value={formData.aadhar}
                  onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Account Holder</label>
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">PAN Number</label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Nominee Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Nominee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nominee Name</label>
                <input
                  type="text"
                  value={formData.nomineeName}
                  onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Relation</label>
                <input
                  type="text"
                  value={formData.nomineeRelation}
                  onChange={(e) => setFormData({ ...formData, nomineeRelation: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nominee DOB</label>
                <input
                  type="date"
                  value={formData.nomineeDob}
                  onChange={(e) => setFormData({ ...formData, nomineeDob: e.target.value })}
                  className="w-full bg-background border rounded-lg p-3"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end gap-4 pt-6"
            >
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                Save Changes
              </button>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}