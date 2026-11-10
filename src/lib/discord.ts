// src/lib/discord.ts
export async function sendOtpToDiscord(username: string, code: string, ip?: string) {
  const url = process.env.ADMIN_DISCORD_WEBHOOK_URL?.trim();
  if (!url || !url.startsWith("https://discord.com/api/webhooks/")) {
    throw new Error(
      "ADMIN_DISCORD_WEBHOOK_URL chưa cấu hình hoặc không hợp lệ. Cần URL dạng https://discord.com/api/webhooks/{id}/{token}"
    );
  }

  const body = {
    content: "🔐 **OTP đăng nhập admin**",
    embeds: [
      {
        title: "Mã xác thực 2 lớp",
        color: 0xff9900,
        fields: [
          { name: "Tài khoản", value: username, inline: true },
          { name: "IP", value: ip || "—", inline: true },
          { name: "Mã OTP", value: `**\`${code}\`**`, inline: false },
          { name: "Hết hạn", value: "5 phút", inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Discord OTP webhook failed:", res.status, text);
    throw new Error(`Discord OTP send failed (HTTP ${res.status})`);
  }
}

export interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

export async function sendDiscordNotification(
  content: string,
  fields?: DiscordField[],
  color = 0x2563eb
) {
  const url = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!url || !url.startsWith("https://discord.com/api/webhooks/")) {
    console.warn("DISCORD_WEBHOOK_URL chưa cấu hình, bỏ qua thông báo.");
    return;
  }

  const body: Record<string, unknown> = { content };

  if (fields && fields.length > 0) {
    body.embeds = [
      {
        color,
        fields: fields.map((f) => ({
          name: f.name,
          value: f.value || "—",
          inline: f.inline ?? true,
        })),
        timestamp: new Date().toISOString(),
      },
    ];
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Discord notification failed:", res.status, text);
    }
  } catch (err) {
    console.error("Discord notification error:", err);
  }
}