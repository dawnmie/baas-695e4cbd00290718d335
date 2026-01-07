# Appwrite + React Demo (OAuth2)

This is a simple demo project using Appwrite and React with Alibaba OAuth2 authentication.

## Setup

```bash
npm install
npm run dev
```

## Configuration

The Appwrite client is configured in `src/appwrite.js`:

- **Endpoint**: https://appbuild.space/v1
- **Project ID**: 695e4cbd00290718d335

## Features

- OAuth2 login (Alibaba)
- User avatar display (top right corner)
- User logout

## OAuth2 Setup

Before using this template, make sure to configure Alibaba OAuth2 provider in your Appwrite project:

1. Go to your Appwrite Console
2. Navigate to Authentication > Providers
3. Enable Alibaba OAuth2 provider
4. Configure App ID and Secret
5. Set the callback URL

## Avatar Display

The app automatically fetches and displays user avatars from Alibaba's internal photo service. Avatars are cached in localStorage for 24 hours to improve performance.
