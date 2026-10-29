import React from "react";

export default function SignIllustration({ type = "building", className = "" }) {
  return (
    <svg className={className} viewBox="0 0 400 220" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M30 182h340M52 198h26m11 0h7m213 0h42" opacity=".4" />
        {type === "drive" && <>
          <path d="M176 182V80h174v102M164 80h197l-14-23H181z" />
          <path d="M244 101h64v24h-64zM204 144h116v38M78 182V69h59v113M86 80h43v35H86zM86 124h43v35H86z" />
          <path d="M45 161h102m-13-9 13 9-13 9M193 42h143" opacity=".45" />
        </>}
        {(type === "building" || type === "research" || type === "permit" || type === "variance") && <>
          <path d="M67 182V76h266v106M58 76h284V59H58zM106 115h49v67h-49zM183 126h109v35H183z" />
          <path d="M183 90h109v23H183zM121 149h8M213 126v35m38-35v35" />
          {type === "research" && <path d="M43 57v125m-7-125h14m-14 125h14M67 39h266m-266-7v14m266-14v14" strokeDasharray="4 5" />}
          {type === "permit" && <path d="M292 45h55v73h-55zM301 59h36m-36 12h30m-30 12h36m-36 12h20" />}
          {type === "variance" && <path d="M35 115h37m-9-8 9 8-9 8M313 35l24 14-24 14z" />}
        </>}
        {type === "bank" && <>
          <path d="m65 73 131-38 136 38H65ZM77 82h245v100H77zM110 95v72m27-72v72m121-72v72m27-72v72M170 116h49v66h-49z" />
          <path d="M38 182v-66h29v66M43 126h19v18H43zM329 182v-89h34v89M335 106h22v23h-22zM63 173h264" />
        </>}
        {type === "community" && <>
          <path d="M51 182v-78l44-36 44 36v78M42 105l53-45 53 45M78 182v-44h33v44M63 113h18v17H63zM109 113h18v17h-18z" />
          <path d="M252 182v-78l44-36 44 36v78M243 105l53-45 53 45M279 182v-44h33v44M264 113h18v17h-18zM310 113h18v17h-18z" />
          <path d="M156 182v-58h80v58M163 133h66v25h-66zM146 182v-10h100v10" />
        </>}
      </g>
    </svg>
  );
}
