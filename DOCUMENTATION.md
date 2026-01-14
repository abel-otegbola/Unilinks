# UniLinks Platform Documentation

Welcome to UniLinks! This guide will help you get started with creating and managing payment links on our platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Payment Links](#creating-payment-links)
3. [Managing Payment Methods](#managing-payment-methods)
4. [Dashboard Overview](#dashboard-overview)
5. [Sharing Payment Links](#sharing-payment-links)
6. [Tracking Payments](#tracking-payments)
7. [Account Settings](#account-settings)
8. [FAQs](#faqs)

---

## Getting Started

### Creating Your Account

1. Visit the [UniLinks homepage](/)
2. Click **"Get Started for free"** or **"Login"**
3. Select **"Register"** to create a new account
4. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 8 characters)
5. Click **"Sign Up"**
6. You'll receive a verification email - verify your account
7. Log in with your credentials

### First Login

After logging in for the first time, you'll see your dashboard with:
- Navigation sidebar
- Empty payment links list
- Quick action buttons to create your first payment link

---

## Creating Payment Links

### Step 1: Navigate to Links Section

1. Click **"Links"** in the sidebar menu
2. Click the **"+ Add Payment Link"** button

### Step 2: Fill in Payment Details

You'll need to provide:

- **Title/Description**: What is this payment for?
  - Example: "Website Design Services", "Product Purchase", "Monthly Subscription"

- **Amount**: How much do you want to charge?
  - Enter the numerical amount (e.g., 100.00)

- **Currency**: Select your preferred currency
  - Options: USD, EUR, GBP, BTC, ETH, etc.

- **Payment Method**: How will customers pay?
  - **Crypto**: Bitcoin, Ethereum, or other cryptocurrencies
  - **Bank Transfer**: Direct bank deposit
  - **PayPal**: PayPal account payments
  - **Stripe**: Credit/debit card payments

### Step 3: Add Optional Details

- **Notes**: Add any additional information for the payer
- **Due Date**: Set a payment deadline (optional)
- **Custom Reference**: Add your own reference number (optional)

### Step 4: Create and Share

1. Click **"Create Payment Link"**
2. Your unique payment link will be generated
3. Copy the link to share with your customer

### Example Payment Link Flow

```
Title: "Logo Design Project"
Amount: 500.00
Currency: USD
Payment Method: PayPal
Notes: "50% deposit for logo design project - Revision 1"

Generated Link: https://unilinks.app/pay/PL-ABC123XYZ
```

---

## Managing Payment Methods

Before creating payment links, you should add your payment method details so customers know where to send money.

### Adding Payment Methods

1. Click **"Payment Methods"** in the sidebar
2. Click **"+ Add Payment Method"**
3. Select payment type and fill in details:

#### For Cryptocurrency
- Wallet Address
- Cryptocurrency Type (BTC, ETH, USDT, etc.)
- Network (if applicable)

#### For Bank Transfer
- Bank Name
- Account Number
- Account Name
- Routing Number (if applicable)
- SWIFT/IBAN (for international)

#### For PayPal
- PayPal Email Address
- PayPal.me Link (optional)

#### For Stripe
- Stripe Account ID
- Connected Account Details

### Setting Default Payment Methods

1. Navigate to your payment methods list
2. Click the **star icon** next to your preferred method
3. This will be selected by default when creating new links

---

## Dashboard Overview

Your dashboard is your control center. Here's what you'll find:

### Main Dashboard

- **Total Links Created**: Overall count of payment links
- **Active Links**: Currently active payment links
- **Completed Payments**: Successfully paid links
- **Total Revenue**: Sum of all completed payments

### Links Section

View all your payment links with:
- Status indicators (Pending, Paid, Expired, Cancelled)
- Quick actions (Edit, Delete, Copy Link, View Details)
- Search and filter options

### Recent Activity

- Latest payment link creations
- Recent payment receipts
- Status changes and updates

---

## Sharing Payment Links

### Copy Link Method

1. Go to your **Links** section
2. Find the payment link you want to share
3. Click the **"Copy Link"** button
4. Paste and share via:
   - Email
   - SMS/WhatsApp
   - Social media
   - Messaging apps

### QR Code Sharing

1. Click on a payment link to view details
2. Click **"Generate QR Code"**
3. Download or share the QR code image
4. Customers can scan with their phone camera to access the payment page

### Email Sharing

1. Copy your payment link
2. Compose an email to your customer
3. Include the payment link with context:

```
Hi [Customer Name],

Thank you for your order! Please complete your payment using the link below:

Payment Link: https://unilinks.app/pay/PL-ABC123XYZ
Amount: $500.00
Description: Logo Design Project

If you have any questions, please don't hesitate to contact me.

Best regards,
[Your Name]
```

---

## Tracking Payments

### Real-Time Status Updates

Payment links automatically update their status:
- **Pending**: Awaiting payment
- **Paid**: Payment received and confirmed
- **Expired**: Payment deadline passed
- **Cancelled**: Manually cancelled by you

### Viewing Payment Details

1. Click on any payment link in your dashboard
2. View comprehensive details:
   - Customer information (if provided)
   - Payment timeline
   - Transaction details
   - Payment proof/receipt

### Payment Timeline

Each payment link has a timeline showing:
- Link created
- Link shared/viewed
- Payment initiated
- Payment confirmed
- Any status changes or notes

### Exporting Data

1. Open a payment link's detail page
2. Click **"Export as PDF"**
3. Download receipt or invoice for your records

---

## Account Settings

### Profile Management

1. Click **"Profile"** in the sidebar
2. Update your information:
   - Full Name
   - Email Address
   - Profile Picture
   - Business/Brand Name
   - Contact Information

### Security Settings

1. Go to **"Settings"**
2. Security options:
   - **Change Password**: Update your login password
   - **Email Notifications**: Configure alert preferences
   - **Two-Factor Authentication**: Enable for extra security (if available)

### Notification Preferences

Configure when you want to receive notifications:
- New payment received
- Payment link viewed
- Payment link expired
- Weekly summary reports

### Account Deletion

If you need to delete your account:
1. Go to **Settings**
2. Scroll to **"Delete Account"**
3. Read the warning carefully
4. Confirm deletion

⚠️ **Warning**: Account deletion is permanent and cannot be undone. All your data will be lost.

---

## FAQs

### General Questions

**Q: Is UniLinks free to use?**
A: Yes, creating an account and generating payment links is free.

**Q: How many payment links can I create?**
A: There's no limit on the number of payment links you can create.

**Q: Can I edit a payment link after creating it?**
A: Yes, you can edit pending payment links. Once paid, links become read-only for record-keeping.

### Payment Questions

**Q: When will I receive the payment?**
A: Payment timing depends on the payment method:
- Crypto: Within minutes to hours (depends on blockchain confirmation)
- Bank Transfer: 1-3 business days
- PayPal: Instant to 24 hours
- Stripe: Instant to 2-3 business days

**Q: Does UniLinks hold my payments?**
A: No, payments go directly to your provided payment method accounts.

**Q: Are there any transaction fees?**
A: UniLinks doesn't charge fees, but payment processors (PayPal, Stripe, banks) may have their own fees.

### Technical Questions

**Q: Can customers pay without creating an account?**
A: Yes, customers only need the payment link. No account required.

**Q: Is my data secure?**
A: Yes, we use bank-level encryption and Firebase security for all data.

**Q: Can I use UniLinks on mobile?**
A: Yes, UniLinks is fully responsive and works on all devices.

**Q: What browsers are supported?**
A: All modern browsers (Chrome, Firefox, Safari, Edge) are supported.

### Troubleshooting

**Q: I can't log in to my account**
- Verify your email and password are correct
- Try resetting your password
- Clear browser cache and cookies
- Contact support if issues persist

**Q: My payment link isn't working**
- Check if the link has expired
- Verify the payment method details are correct
- Ensure the link wasn't accidentally deleted

**Q: Customer says they paid but status shows pending**
- Check your payment method account for deposits
- Payment confirmations can take time depending on method
- Manually update status if needed

---

## Getting Help

### Support Resources

- **Email**: abel.d.otegbola@gmail.com
- **GitHub Issues**: [Report bugs or request features](https://github.com/abel-otegbola/unilinks/issues)
- **Documentation**: This guide and README.md

### Tips for Success

1. **Be Clear**: Use descriptive titles for payment links
2. **Be Prompt**: Respond to payment confirmations quickly
3. **Be Organized**: Use references and notes to track payments
4. **Be Secure**: Never share your login credentials
5. **Be Professional**: Communicate clearly with customers

---

## Next Steps

Now that you understand how to use UniLinks, here's what to do next:

1. ✅ Complete your profile information
2. ✅ Add at least one payment method
3. ✅ Create your first payment link
4. ✅ Test the payment flow
5. ✅ Share with your first customer

**Ready to get started?** [Go to Dashboard](/account) or [Create Your First Link](/account/links)

---

*Last Updated: January 14, 2026*
