"use client";

import React, { useEffect, useState } from "react";
import * as SubframeCore from "@subframe/core";
import { IconWithBackground } from "./IconWithBackground";
import { AiChatToolbar } from "./AiChatToolbar";
import { getRecommendation } from "../../services/AI/recommendMessageService";

interface AiChatReceivedRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AiChatReceivedRoot = React.forwardRef<
  HTMLElement,
  AiChatReceivedRootProps
>(function AiChatReceivedRoot({ className, ...otherProps }, ref) {
  const [message, setMessage] = useState<string>("Đang tải...");

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        const response = await getRecommendation();
        setMessage(response.data.message); // Giả sử API trả về { message: "Nội dung AI phản hồi" }
      } catch (error) {
        setMessage("Lỗi khi nhận phản hồi từ AI.");
      }
    }

    fetchRecommendation();
  }, []);

  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full items-start gap-4 pt-2 pb-2",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <IconWithBackground size="medium" icon="FeatherSparkle" />
      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
        <div className="flex w-full flex-col items-start pt-1.5">
          <p className="text-body font-body text-default-font">{message}</p>
        </div>
        <AiChatToolbar />
      </div>
    </div>
  );
});

export const AiChatReceived = AiChatReceivedRoot;
