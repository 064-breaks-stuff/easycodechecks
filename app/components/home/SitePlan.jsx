import React from "react";
import styles from "../../styles/home.module.css";
import sceneStyles from "../../styles/scene.module.css";

export default function SitePlan({ children = null, sceneReady = false }) {
  return (
    <figure className={styles.sitePlan}>
      <div className={styles.planTopline}>
        <span>SITE STUDY / 001</span>
        <span>CONCEPT VIEW</span>
      </div>
      <div className={sceneStyles.stage}>
        <div className={`${sceneStyles.poster} ${sceneReady ? sceneStyles.posterHidden : ""}`}>
      <svg className={styles.planDrawing} viewBox="0 0 620 540" fill="none" aria-hidden="true" focusable="false">
        <g stroke="#72988a" strokeWidth="1">
          <path d="m44 348 297-170 233 135-295 172z" fill="#183b31" />
          <path d="m66 350 274-157 211 122-272 157z" strokeDasharray="5 7" />
          <path d="m122 344 193-110 178 103-192 110z" stroke="#3b6355" />
          <path d="m124 362 192-110m-171 123 192-111m-170 123 191-111m-169 124 191-111m-168 124 190-111" stroke="#3b6355" />
          <path d="m289 225 164 95v107m-201-181 164 95v107" stroke="#3b6355" />
        </g>
        <g stroke="#a6bbaf" strokeWidth="1.3" strokeLinejoin="round">
          <path d="m208 260 128-74 135 78-127 74z" fill="#345c4b" />
          <path d="M208 260v-97l128-74v97z" fill="#264c3e" />
          <path d="M336 89 471 167v97l-135-78z" fill="#1b3e32" />
          <path d="m208 163 135 78 128-74M343 241v97" fill="#365e4b" />
          <path d="m208 163 128-74 135 78-128 74z" fill="#426d57" />
          <path d="m221 160 115-66 121 70-114 66z" stroke="#72988a" />
          <path d="m365 249 75-43v26l-75 44z" fill="#c7e879" stroke="#c7e879" />
          <path d="m363 288 79-46v50l-79 46z" fill="#102b24" />
          <path d="M392 271v51m24-66v51" stroke="#72988a" />
          <path d="m231 212 34 20v61l-34-20z" fill="#102b24" />
          <path d="m280 240 40 23v28l-40-23z" fill="#426d57" />
          <path d="m154 364 21-12 38 22-21 12z" fill="#426d57" />
          <path d="M154 364v-81l21-12v81z" fill="#264c3e" />
          <path d="m175 271 38 22v81l-38-22z" fill="#426d57" />
          <path d="m181 286 25 14v24l-25-14z" fill="#c7e879" stroke="#c7e879" />
          <path d="m181 337 25 14" stroke="#c7e879" />
        </g>
        <g stroke="#c7e879" strokeWidth="1" opacity=".8">
          <path d="M154 267v-60h-51M442 222l61-36h51M217 388l-35 20v45" strokeDasharray="3 5" />
          <circle cx="154" cy="283" r="4" fill="#c7e879" />
          <circle cx="442" cy="222" r="4" fill="#c7e879" />
          <circle cx="217" cy="388" r="4" fill="#c7e879" />
          <path d="m211 143 124-72m-127 64 6 16m117-88 7 16M485 174v99m-6-102h12m-12 105h12" />
        </g>
        <g fill="#d7e4d5" fontFamily="monospace" fontSize="10" letterSpacing="1">
          <text x="55" y="198">MONUMENT SIGN</text>
          <text x="481" y="177">WALL SIGN</text>
          <text x="135" y="470">SITE CONTEXT</text>
        </g>
        <g stroke="#72988a" strokeWidth="1">
          <path d="M540 418v-39m-8 12 8-12 8 12" />
          <path d="M55 75h22m-11-11v22M543 74h22m-11-11v22" opacity=".55" />
        </g>
        <text x="536" y="436" fill="#a6bbaf" fontFamily="monospace" fontSize="11">N</text>
      </svg>
        </div>
        {children}
      </div>
      <figcaption className={styles.planCaption}>
        <span><i aria-hidden="true" /> From site context to signage requirements.</span>
        <span>Illustrative only · Not a permit drawing</span>
      </figcaption>
    </figure>
  );
}
