export async function POST(req: Request) {
  const encoder = new TextEncoder();
  const text = "Chào bạn! Đây là câu trả lời demo từ AI cho website giatoctrantrongthu.com. Hệ thống tri thức và tư liệu sẽ sớm được tích hợp ở các giai đoạn sau.";

  const stream = new ReadableStream({
    async start(controller) {
      for (const char of text) {
        controller.enqueue(encoder.encode(char));
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}


