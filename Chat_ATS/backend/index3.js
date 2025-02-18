const express = require('express');
const ipRangeCheck = require('ip-range-check');
const app = express();
const PORT = 5000;

// Correct office network range (IPv4 and IPv6)
const allowedOfficeIPRangeV4 = '192.168.29.0/24';
const allowedOfficeIPRangeV6 = '2405:201:a004:c0e3::/64'; // Adjust based on your IPv6 range

// Enable proxy trust (important for deployed apps)
app.set('trust proxy', true);

app.use((req, res, next) => {
  let clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Convert IPv6-mapped IPv4 (::ffff:192.168.29.45) to plain IPv4
  if (clientIP.includes('::ffff:')) {
    clientIP = clientIP.split('::ffff:')[1];
  }

  console.log('Detected Client IP:', clientIP);

  // Check if the IP is within the allowed range
  if (ipRangeCheck(clientIP, allowedOfficeIPRangeV4) || ipRangeCheck(clientIP, allowedOfficeIPRangeV6)) {
    next(); // Allow access
  } else {
    res.status(403).send('Access denied. This site is only accessible from your office network.');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the office-restricted site!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// SSID:	Dayacs Jio 2G
// Protocol:	Wi-Fi 4 (802.11n)
// Security type:	WPA2-Personal
// Network band:	2.4 GHz
// Network channel:	1
// Link speed (Receive/Transmit):	144/72 (Mbps)
// IPv6 address:	2405:201:a004:c0e3:54a9:e483:8c1:ed47
// Link-local IPv6 address:	fe80::7fbc:b009:1e12:4885%16
// IPv6 DNS servers:	2405:201:a004:c0e3::c0a8:1d01
// IPv4 address:	192.168.29.45
// IPv4 DNS servers:	192.168.29.1
// Manufacturer:	Qualcomm Atheros Communications Inc.
// Description:	Qualcomm Atheros QCA9377 Wireless Network Adapter
// Driver version:	12.0.0.910
// Physical address (MAC):	E8-D0-FC-84-37-27