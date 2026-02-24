FROM node:20-alpine

# Install Tesseract OCR and dependencies
RUN apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    ghostscript \
    graphicsmagick

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (if needed for future HTTP interface)
EXPOSE 3002

# Start the application
CMD ["node", "server.js"]
