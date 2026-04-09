import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // ここで実際のメール送信ロジックを実装します (e.g. SendGrid, Nodemailer)
    // 今回はデモとしてコンソール出力のみ行い、成功レスポンスを返します。
    // 本番環境では環境変数を使用してメールサービスに接続してください。
    
    console.log("Contact form submission:", {
      to: "uken.shohei@gmail.com",
      from: email,
      name: name,
      message: message,
    });

    // NOTE: 実際のメール送信を実装する場合の例 (Nodemailer使用)
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "uken.shohei@gmail.com",
      subject: `[AMALINK] お問い合わせ: ${name}様`,
      text: `
        名前: ${name}
        メール: ${email}
        
        メッセージ:
        ${message}
      `,
    });
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

