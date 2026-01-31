# GreenPulse Infinityhost Deployment

This directory contains all the necessary files and documentation for deploying your GreenPulse project on Infinityhost.

## Files Included

- `DEPLOYMENT_GUIDE_INFINITYHOST.md` - Complete step-by-step deployment guide
- `INFINITYHOST_README.md` - This file with quick start instructions

## Quick Start

1. **Prerequisites**: Ensure you have a Node.js compatible hosting plan with Infinityhost
2. **Database Setup**: Create MySQL database and user in Infinityhost control panel
3. **Environment Configuration**: Set up environment variables in Infinityhost
4. **File Upload**: Upload your project files to Infinityhost
5. **Application Setup**: Configure and start your Node.js application
6. **Domain & SSL**: Configure your domain and enable SSL certificate

## Key Changes Made for Infinityhost

### Server Configuration
- Removed MongoDB dependency (mongoose) from package.json
- Kept MySQL2 for database connectivity
- Maintained existing Express.js structure

### Frontend Configuration
- Updated API URLs in both `client/script.js` and `client/admin/script.js`
- Changed from `your-backend-url.com` to `api.yourdomain.com`
- Maintained localhost fallback for development

### Database
- MySQL database configuration maintained
- Database connection logic unchanged
- Table creation scripts preserved

## Environment Variables Required

```
PORT=5000
DB_HOST=localhost
DB_USER=greenpulse_user
DB_PASSWORD=your_database_password
DB_NAME=greenpulse
JWT_SECRET=your_very_long_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
NODE_ENV=production
```

## Support

For deployment issues, refer to:
- `DEPLOYMENT_GUIDE_INFINITYHOST.md` for detailed instructions
- Infinityhost documentation and support
- Node.js and MySQL documentation

## Notes

- This configuration assumes you're using a subdomain (api.yourdomain.com) for your backend
- The frontend will be served from your main domain (yourdomain.com)
- SSL certificates are automatically managed by Infinityhost
- Database backups and monitoring should be configured separately