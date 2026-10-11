<template>
  <div
    ref="containerRef"
    class="timber-peg-slider"
    :style="containerStyle"
    @pointerdown="handleContainerPointerDown"
  >
    <!-- LEFT LAYER (BEFORE) -->
    <div class="layer layer-left">
      <video
        v-if="beforeType === 'video' && beforeVideoUrl"
        class="media-content"
        :src="beforeVideoUrl"
        autoplay
        muted
        loop
        playsinline
      ></video>
      <img
        v-else-if="beforeImageUrl"
        class="media-content"
        :src="beforeImageUrl"
        alt="Before timber work"
      />

      <!-- Top Left Badge -->
      <div v-if="beforeBadgeText" class="badge badge-left">
        <span class="badge-dot badge-dot-before"></span>
        <span class="badge-text">{{ beforeBadgeText }}</span>
      </div>
    </div>

    <!-- RIGHT LAYER (AFTER) -->
    <div class="layer layer-right" :style="rightLayerStyle">
      <video
        v-if="afterType === 'video' && afterVideoUrl"
        class="media-content"
        :src="afterVideoUrl"
        autoplay
        muted
        loop
        playsinline
      ></video>
      <img
        v-else-if="afterImageUrl"
        class="media-content"
        :src="afterImageUrl"
        alt="After finished sanctuary"
      />

      <!-- Top Right Badge -->
      <div v-if="afterBadgeText" class="badge badge-right">
        <span class="badge-text">{{ afterBadgeText }}</span>
        <span class="badge-dot badge-dot-after"></span>
      </div>

      <!-- Floating Content Overlay -->
      <div v-if="showOverlay" class="overlay-card" @pointerdown.stop>
        <h3 v-if="overlayTitle" class="overlay-title">{{ overlayTitle }}</h3>
        <p v-if="overlaySubtext" class="overlay-subtext">{{ overlaySubtext }}</p>
        <button
          v-if="showCta && ctaText"
          type="button"
          class="cta-button"
          @click.stop="handleCtaClick"
        >
          <span>{{ ctaText }}</span>
          <svg class="cta-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- WOODEN PEG DIVIDER & HANDLE -->
    <div class="divider-wrapper" :style="dividerWrapperStyle">
      <div class="divider-line" :style="dividerLineStyle"></div>

      <div
        ref="handleRef"
        class="peg-handle"
        :class="{ 'is-dragging': isDragging }"
        :style="pegHandleStyle"
        @pointerdown.stop.prevent="handleHandlePointerDown"
      >
        <div class="peg-ring"></div>
        <div class="peg-content">
          <svg
            class="peg-arrows-icon"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Mortise vertical slot markers -->
            <line
              x1="9"
              y1="8"
              x2="9"
              y2="24"
              stroke="#FDF6E2"
              stroke-width="2"
              stroke-linecap="round"
              opacity="0.85"
            />
            <line
              x1="23"
              y1="8"
              x2="23"
              y2="24"
              stroke="#FDF6E2"
              stroke-width="2"
              stroke-linecap="round"
              opacity="0.85"
            />
            <!-- Left & Right arrows -->
            <path
              d="M14 11L10 16L14 21"
              stroke="#FDF6E2"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18 11L22 16L18 21"
              stroke="#FDF6E2"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";

export default {
  name: "TimberPegSlider",
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
  },
  emits: ["trigger-event"],
  setup(props, { emit }) {
    const containerRef = ref(null);
    const handleRef = ref(null);
    const isDragging = ref(false);

    const isEditing = computed(() => {
      // eslint-disable-next-line no-unreachable
      return false;
    });

    // WeWeb Variable setup
    const { value: variablePos, setValue: setVariablePos } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "sliderPosition",
        type: "number",
        defaultValue: props.content?.initialPosition ?? 50,
      });

    const currentPosition = ref(props.content?.initialPosition ?? 50);

    // Sync from component variable if updated externally
    watch(
      () => variablePos.value,
      (newVal) => {
        if (typeof newVal === "number" && !isNaN(newVal) && newVal !== currentPosition.value) {
          currentPosition.value = Math.max(0, Math.min(100, newVal));
        }
      }
    );

    onMounted(() => {
      const init = props.content?.initialPosition;
      if (typeof init === "number" && !isNaN(init)) {
        currentPosition.value = Math.max(0, Math.min(100, init));
      }
    });

    // Content Computed Properties
    const beforeType = computed(() => props.content?.beforeType ?? "video");
    const beforeVideoUrl = computed(
      () =>
        props.content?.beforeVideoUrl ??
        "https://assets.mixkit.co/videos/preview/mixkit-carpenter-working-with-wood-41561-large.mp4"
    );
    const beforeImageUrl = computed(
      () =>
        props.content?.beforeImageUrl ??
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    );
    const beforeBadgeText = computed(
      () => props.content?.beforeBadgeText ?? "BEFORE — 2 WINTERS OF MILLING"
    );

    const afterType = computed(() => props.content?.afterType ?? "image");
    const afterImageUrl = computed(
      () =>
        props.content?.afterImageUrl ??
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
    );
    const afterVideoUrl = computed(() => props.content?.afterVideoUrl ?? "");
    const afterBadgeText = computed(
      () => props.content?.afterBadgeText ?? "AFTER — THE SANCTUARY"
    );

    const showOverlay = computed(() => props.content?.showOverlay ?? true);
    const overlayTitle = computed(
      () => props.content?.overlayTitle ?? "Handbuilt by Bear"
    );
    const overlaySubtext = computed(
      () =>
        props.content?.overlaySubtext ??
        "Reclaiming century-old timber with reverence and care, Bear spent two full winters hand-milling every beam."
    );
    const showCta = computed(() => props.content?.showCta ?? true);
    const ctaText = computed(() => props.content?.ctaText ?? "Book a Tour");

    const dividerColor = computed(
      () => props.content?.dividerColor ?? "#C89D66"
    );
    const pegBgDark = computed(() => props.content?.pegBgDark ?? "#5C3A1E");
    const pegBgLight = computed(() => props.content?.pegBgLight ?? "#8B5A2B");
    const pegBorderColor = computed(
      () => props.content?.pegBorderColor ?? "#D4AF37"
    );
    const borderRadius = computed(() => props.content?.borderRadius ?? "16px");

    // Dynamic Styles
    const containerStyle = computed(() => ({
      borderRadius: borderRadius.value,
    }));

    const rightLayerStyle = computed(() => ({
      clipPath: `inset(0 0 0 ${currentPosition.value}%)`,
    }));

    const dividerWrapperStyle = computed(() => ({
      left: `${currentPosition.value}%`,
    }));

    const dividerLineStyle = computed(() => ({
      backgroundColor: dividerColor.value,
    }));

    const pegHandleStyle = computed(() => ({
      background: `radial-gradient(circle at 35% 35%, ${pegBgLight.value} 0%, ${pegBgDark.value} 75%, #3D2310 100%)`,
      borderColor: pegBorderColor.value,
    }));

    // Update position helper
    let lastSentPos = currentPosition.value;
    const updatePosition = (clientX) => {
      if (!containerRef.value) return;
      const rect = containerRef.value.getBoundingClientRect();
      if (rect.width <= 0) return;

      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      pct = Math.round(pct * 10) / 10;

      if (pct !== currentPosition.value) {
        currentPosition.value = pct;
        if (pct !== lastSentPos) {
          lastSentPos = pct;
          if (setVariablePos) {
            setVariablePos(pct);
          }
          emit("trigger-event", {
            name: "sliderChange",
            event: { position: pct },
          });
        }
      }
    };

    // Pointer events for dragging handle with setPointerCapture
    const onPointerMove = (e) => {
      if (!isDragging.value) return;
      updatePosition(e.clientX);
    };

    const stopDragging = (e) => {
      if (!isDragging.value) return;
      isDragging.value = false;

      if (e?.target && typeof e.target.releasePointerCapture === "function") {
        try {
          if (e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Silent catch for unexpected releases
        }
      }

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };

    const handleHandlePointerDown = (e) => {
      isDragging.value = true;
      if (e?.target && typeof e.target.setPointerCapture === "function") {
        try {
          e.target.setPointerCapture(e.pointerId);
        } catch {
          // Fallback if capture fails
        }
      }
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", stopDragging);
      window.addEventListener("pointercancel", stopDragging);
    };

    const handleContainerPointerDown = (e) => {
      // Tap anywhere on frame moves peg immediately
      updatePosition(e.clientX);
    };

    const handleCtaClick = () => {
      if (isEditing.value) return;
      emit("trigger-event", {
        name: "ctaClick",
        event: { text: ctaText.value },
      });
    };

    // Actions
    const setPosition = (pos) => {
      if (typeof pos !== "number" || isNaN(pos)) return;
      const clamped = Math.round(Math.max(0, Math.min(100, pos)) * 10) / 10;
      currentPosition.value = clamped;
      lastSentPos = clamped;
      if (setVariablePos) {
        setVariablePos(clamped);
      }
      emit("trigger-event", {
        name: "sliderChange",
        event: { position: clamped },
      });
    };

    const resetPosition = () => {
      const init = props.content?.initialPosition ?? 50;
      setPosition(init);
    };

    return {
      containerRef,
      handleRef,
      isDragging,
      isEditing,
      currentPosition,
      beforeType,
      beforeVideoUrl,
      beforeImageUrl,
      beforeBadgeText,
      afterType,
      afterImageUrl,
      afterVideoUrl,
      afterBadgeText,
      showOverlay,
      overlayTitle,
      overlaySubtext,
      showCta,
      ctaText,
      containerStyle,
      rightLayerStyle,
      dividerWrapperStyle,
      dividerLineStyle,
      pegHandleStyle,
      handleContainerPointerDown,
      handleHandlePointerDown,
      handleCtaClick,
      setPosition,
      resetPosition,
    };
  },
};
</script>

<style scoped>
.timber-peg-slider {
  position: relative;
  width: 100%;
  max-width: 1000px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  background-color: #120e0b;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .timber-peg-slider {
    aspect-ratio: 4 / 5;
    min-height: 500px;
  }
}

.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.layer-left {
  z-index: 1;
}

.layer-right {
  z-index: 2;
  will-change: clip-path;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Badges */
.badge {
  position: absolute;
  top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(20, 14, 10, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 157, 102, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  z-index: 3;
}

.badge-left {
  left: 16px;
}

.badge-right {
  right: 16px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.badge-dot-before {
  background-color: #e67e22;
  box-shadow: 0 0 6px #e67e22;
}

.badge-dot-after {
  background-color: #2ecc71;
  box-shadow: 0 0 6px #2ecc71;
}

.badge-text {
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #fdf6e2;
  white-space: nowrap;
}

/* Floating Overlay Card */
.overlay-card {
  position: absolute;
  bottom: 20px;
  right: 20px;
  max-width: 340px;
  padding: 20px 22px;
  border-radius: 12px;
  background: rgba(28, 20, 14, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  z-index: 4;
}

@media (max-width: 640px) {
  .overlay-card {
    bottom: 14px;
    right: 14px;
    left: 14px;
    max-width: none;
    padding: 16px 18px;
  }
}

.overlay-title {
  margin: 0 0 6px 0;
  font-family: serif, inherit;
  font-size: 20px;
  font-weight: 700;
  color: #f8f1df;
  line-height: 1.25;
}

.overlay-subtext {
  margin: 0 0 16px 0;
  font-size: 13px;
  line-height: 1.45;
  color: #d1c2a5;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #c89d66 0%, #8b5a2b 100%);
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.cta-button:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
}

.cta-button:active {
  transform: translateY(0);
}

.cta-icon {
  width: 16px;
  height: 16px;
}

/* Wooden Peg Divider & Handle */
.divider-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  z-index: 10;
  transform: translateX(-50%);
  pointer-events: none;
  will-change: left;
}

.divider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
}

.peg-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 44px;
  height: 44px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.25);
  cursor: ew-resize;
  pointer-events: auto;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.peg-handle:hover,
.peg-handle.is-dragging {
  transform: translate(-50%, -50%) scale(1.08);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.7), inset 0 2px 6px rgba(255, 255, 255, 0.35);
}

.peg-ring {
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  border: 1px dashed rgba(253, 246, 226, 0.3);
  pointer-events: none;
}

.peg-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.peg-arrows-icon {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
}
</style>
