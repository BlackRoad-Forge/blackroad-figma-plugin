/**
 * BlackRoad OS - Cloudflare Worker
 * Handles long-running tasks, health checks, and brand API endpoints.
 *
 * Copyright (c) 2024-2026 BlackRoad OS, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 */

const BRAND_COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  hotPink: "#FF1D6C",
  amber: "#F5A623",
  electricBlue: "#2979FF",
  violet: "#9C27B0",
  orange: "#F26522",
  magenta: "#E91E63",
  skyBlue: "#448AFF",
  deepPurple: "#5E35B1",
};

const FIBONACCI_SPACING = {
  xs: 8,
  sm: 13,
  md: 21,
  lg: 34,
  xl: 55,
  "2xl": 89,
  "3xl": 144,
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      switch (url.pathname) {
        case "/":
          return jsonResponse({
            name: "BlackRoad OS Worker",
            version: "2.0.0",
            status: "running",
            owner: "BlackRoad OS, Inc.",
          });

        case "/api/health":
          return jsonResponse({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: "ok",
          });

        case "/api/brand":
          return jsonResponse({
            colors: BRAND_COLORS,
            spacing: FIBONACCI_SPACING,
            typography: {
              fontFamily: "SF Pro Display",
              lineHeight: 1.618,
            },
            gradient: {
              angle: 135,
              stops: [
                { color: BRAND_COLORS.hotPink, position: 0 },
                { color: BRAND_COLORS.amber, position: 38.2 },
                { color: BRAND_COLORS.electricBlue, position: 61.8 },
                { color: BRAND_COLORS.violet, position: 100 },
              ],
            },
          });

        case "/api/brand/colors":
          return jsonResponse(BRAND_COLORS);

        case "/api/brand/spacing":
          return jsonResponse(FIBONACCI_SPACING);

        case "/api/tasks":
          if (request.method === "POST") {
            return await handleTask(request, env, ctx);
          }
          return jsonResponse(
            { error: "Method not allowed" },
            { status: 405 }
          );

        default:
          return jsonResponse({ error: "Not found" }, { status: 404 });
      }
    } catch (err) {
      return jsonResponse(
        { error: "Internal server error", message: err.message },
        { status: 500 }
      );
    }
  },
};

async function handleTask(request, env, ctx) {
  const body = await request.json();
  const { type, payload } = body;

  if (!type) {
    return jsonResponse(
      { error: "Task type is required" },
      { status: 400 }
    );
  }

  const taskId = crypto.randomUUID();

  // Use waitUntil for long-running background tasks
  ctx.waitUntil(processTask(taskId, type, payload, env));

  return jsonResponse({
    taskId,
    type,
    status: "accepted",
    message: "Task queued for processing",
  });
}

async function processTask(taskId, type, payload, env) {
  switch (type) {
    case "generate-tokens":
      return generateDesignTokens(payload);
    case "validate-brand":
      return validateBrandCompliance(payload);
    case "export-styles":
      return exportStyles(payload);
    default:
      console.log(`Unknown task type: ${type}`);
  }
}

function generateDesignTokens(payload) {
  return {
    colors: BRAND_COLORS,
    spacing: FIBONACCI_SPACING,
    generated: new Date().toISOString(),
  };
}

function validateBrandCompliance(payload) {
  const results = [];
  if (payload && payload.colors) {
    for (const [name, value] of Object.entries(payload.colors)) {
      const isValid = Object.values(BRAND_COLORS).includes(value);
      results.push({ name, value, compliant: isValid });
    }
  }
  return { results, checked: new Date().toISOString() };
}

function exportStyles(payload) {
  const format = payload?.format || "css";
  if (format === "css") {
    const vars = Object.entries(BRAND_COLORS)
      .map(([k, v]) => `  --brand-${k}: ${v};`)
      .join("\n");
    const spacing = Object.entries(FIBONACCI_SPACING)
      .map(([k, v]) => `  --spacing-${k}: ${v}px;`)
      .join("\n");
    return `:root {\n${vars}\n${spacing}\n}`;
  }
  return { colors: BRAND_COLORS, spacing: FIBONACCI_SPACING };
}

function jsonResponse(data, options = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status: options.status || 200,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}
