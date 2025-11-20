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
     * HEADER_CLIENT_IP - X-Forwarded-For (client IP)
     * HEADER_CLIENT_PROTO - X-Forwarded-Proto (http/https)
     * HEADER_CLIENT_PORT - X-Forwarded-Port (port number)
     * HEADER_CLIENT_HOST - X-Forwarded-Host (hostname)
     */
    'headers' => [
        \Illuminate\Http\Request::HEADER_FORWARDED => 'FORWARDED',
        \Illuminate\Http\Request::HEADER_CLIENT_IP => 'X-FORWARDED-FOR',
        \Illuminate\Http\Request::HEADER_CLIENT_PROTO => 'X-FORWARDED-PROTO',
        \Illuminate\Http\Request::HEADER_CLIENT_PORT => 'X-FORWARDED-PORT',
        \Illuminate\Http\Request::HEADER_CLIENT_HOST => 'X-FORWARDED-HOST',
    ],
];
