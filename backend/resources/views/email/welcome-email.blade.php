<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #333;
            color: #f4f4f4;
            margin: 0;
            padding: 0;
            background-image: url('{{ asset('images/cover-auth.avif') }}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #444;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            margin-top: 40px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            margin-top: 40px;
        }
        .header img {
            max-width: 300px;
            height: auto;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h1 {
            color: #f4f4f4;
            font-size: 26px;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0;
            color: #ccc;
        }
        .button {
            display: inline-block;
            padding: 15px 25px;
            margin: 20px 0;
            font-size: 16px;
            color: #ffffff;
            background-color: #3ac69f;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth transition */
        }
        .button:hover {
            background-color: #0056b3; /* Darker shade on hover */
            transform: scale(1.1); /* Slightly larger on hover */
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #aaa;
            border-top: 1px solid #555;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="{{ asset('images/logo.png') }}" alt="Your Company Logo">
        </div>
        <div class="content">
            <h1>Hello {{ $user->first_name }},</h1>
            <p>Thank you for registering with us!</p>
            <p>To complete your registration, please click the button below to verify your email address:</p>
            <a href="{{ $verificationUrl }}" class="button">Verify Your Email Address</a>
            <p>If you did not create an account, no further action is required.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Singularity. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>
