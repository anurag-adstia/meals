export { };

declare global {
  interface Window {
    cf_variable?: {
      QUIZ_SUBMIT_BUTTON_ID: string;
      GTM_ID: string;
      PABBLY_URL: string;
      JITSU_EVENT_URL: string;
    };

    _rgba?: {
      q: { tag: string | undefined; render: boolean }[];
      loading?: boolean;
    };

    jitsuLoaded?: () => void;
    jitsu?: {
      track: (event: string, props?: Record<string, unknown>) => void;
      identify: (userId: string, props?: Record<string, unknown>) => void;
    };

    _rgba_tags?: any;

    dataLayer?: Array<Record<string, unknown>>;

    adstiaScripts?: any;

    VoluumScripts?: any;

    clarity?: any;
  }
}
