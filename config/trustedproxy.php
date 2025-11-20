<?php

/**
 * Configure trusted proxies for proper HTTPS detection
 * This is necessary when running behind a reverse proxy (like Railway)
 *
 * When behind a proxy:
 * - The client's real IP comes in X-Forwarded-For header
 * - The protocol (HTTP/HTTPS) comes in X-Forwarded-Proto header
 * - We need to tell Laravel to trust these headers
 */

return [
    /*
     * Set trusted proxies so Laravel correctly detects HTTPS
     * '**' means trust all proxies (safe in this context since Railway is trusted)
     */
    'proxies' => env('TRUSTED_PROXIES') ? explode(',', env('TRUSTED_PROXIES')) : ['**'],

    /*
     * Which headers to trust from the proxy
     * These headers are set by the reverse proxy (Railway) to indicate the real client IP and protocol
     */
    'headers' => [
        'FORWARDED' => 'FORWARDED',
        'CLIENT_IP' => 'X-FORWARDED-FOR',
        'CLIENT_PROTO' => 'X-FORWARDED-PROTO',
        'CLIENT_PORT' => 'X-FORWARDED-PORT',
        'CLIENT_HOST' => 'X-FORWARDED-HOST',
    ],
];
