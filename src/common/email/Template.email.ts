export const signUp = (email) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account Activation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            background-color: #ff6b6b;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            font-size: 24px;
            font-weight: bold;
        }
        .message {
            font-size: 16px;
            color: #374151;
            margin: 20px 0;
        }
        .footer {
            font-size: 14px;
            color: #6b7280;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">Account Activation</div>
        <p class="message">Hello,</p>
        <p class="message">Welcome to our platform! We are excited to have you join us. Your account associated with <strong>${email}</strong> has been successfully created.</p>
        <p class="message">Feel free to explore and enjoy our services.</p>
        <p class="footer">&copy; 2025 Your Company. All rights reserved.</p>
    </div>
</body>
</html>
`;
