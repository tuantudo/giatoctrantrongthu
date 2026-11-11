import * as React from "react";

export function ChatHeader() {
  return (
    <header className="py-6 border-b mb-6 flex flex-col items-center text-center">
      <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
        Trần Trọng Thư
      </h1>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        Trợ lý thông tin và tư liệu trực tuyến
      </p>
    </header>
  );
}
