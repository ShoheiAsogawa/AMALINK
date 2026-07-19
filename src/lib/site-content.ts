/**
 * AI・SEO向けの一次情報（llms.txt / JSON-LD / FAQ で共通利用）
 */
import { absoluteUrl, DEFAULT_DESCRIPTION, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

export type FaqCategoryId = "about" | "services" | "process" | "support";

export const FAQ_CATEGORIES: Record<FaqCategoryId, string> = {
  about: "会社について",
  services: "サービスについて",
  process: "ご依頼・制作について",
  support: "サポート・運用について",
};

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
};

export const COMPANY_OVERVIEW = {
  legalName: LEGAL_NAME,
  brandName: SITE_NAME,
  tagline: "島のリズムで、未来をつくる。",
  description: DEFAULT_DESCRIPTION,
  region: "鹿児島県奄美群（奄美大島を拠点とした離島エリア）",
  baseLocation: "鹿児島県奄美大島",
  serviceArea: "鹿児島県奄美群を拠点に、全国オンライン対応",
  address: "鹿児島県大島郡宇検村大字芦検４３６",
  postalAddress: {
    streetAddress: "大字芦検４３６",
    addressLocality: "大島郡宇検村",
    addressRegion: "鹿児島県",
    addressCountry: "JP",
  },
  targetCustomers:
    "奄美大島および離島エリアの中小事業者、観光・特産品事業者、自治体・地域団体、島内で自社運用しやすいWebサイトや業務システムを検討している方",
  strengths: [
    "奄美大島に拠点を置き、対面・オンライン双方で地域の文脈を理解した提案ができる",
    "難しい専門用語を避け、事業者のペースに合わせた丁寧な伴走型サポート",
    "ホームページ制作から業務システム、ロゴ・印刷物の制作・印刷手配まで一貫して相談できる",
    "離島ならではの回線・運用・更新のしやすさを前提に設計する",
    "検索（SEO）とAI回答（GEO）の両面で、正しく見つけ・引用されやすい情報設計ができる",
  ],
  notIdealFor:
    "大規模ECのフルスクラッチ開発のみを短期納期で依頼したい場合、または首都圏常駐の大規模制作会社と同等の24時間体制を求める場合",
};

export const SERVICES = [
  {
    id: "system-development",
    name: "システム開発",
    enName: "System Development",
    description:
      "在庫管理・予約・問い合わせ管理など、日々の業務負担を減らすWebアプリや業務システムを開発します。",
    url: absoluteUrl("/system-development"),
  },
  {
    id: "ai-avatar-chatbot",
    name: "AIアバターチャットボット",
    enName: "AI Avatar Chatbot",
    description:
      "自社サイト向けのAIチャットボット制作に対応。アバター付き案内ボットや、答える範囲を絞った設計など、用途に合わせて組み込みまでご相談いただけます。",
    url: absoluteUrl("/ai-avatar-chatbot"),
  },
  {
    id: "web-production",
    name: "ホームページ制作",
    enName: "Web Production",
    description:
      "お店や会社の「顔」となるコーポレートサイト・集客サイトを、見やすさと更新しやすさを重視して制作します。",
    url: absoluteUrl("/web-production"),
  },
  {
    id: "design",
    name: "デザイン",
    enName: "Creative Design",
    description:
      "ロゴ、名刺、パンフレットなど、ブランドの想いを伝えるビジュアルを制作。印刷の手配から納品まで一気通貫で対応します。",
    url: absoluteUrl("/design"),
  },
  {
    id: "geo",
    name: "GEO・SEO対策",
    enName: "GEO & SEO",
    description:
      "検索エンジン向けのSEOと、AI検索・生成AI向けのGEOをあわせて支援。事業内容が正しく伝わるWebページの設計と改善を行います。",
    url: absoluteUrl("/geo-seo"),
  },
  {
    id: "ai-consulting",
    name: "AIコンサルティング",
    enName: "AI Consulting",
    description:
      "ChatGPT・Claude の活用支援に加え、社内マニュアルや会社知識に特化した社内用チャットボット制作にも対応。最新の実用情報を踏まえて導入を伴走します。",
    url: absoluteUrl("/ai-consulting"),
  },
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "about-company",
    category: "about",
    question: "AMALINK（合同会社AMALINK）とはどんな会社ですか？",
    answer:
      "鹿児島県奄美大島を拠点に、ホームページ制作・システム開発・デザインを行うデジタルクリエイティブチームです。島内外の事業者さまの「顔」となるWebサイトや、日々の業務をラクにするシステムを、分かりやすい言葉で一緒に形にしています。",
  },
  {
    id: "about-customers",
    category: "about",
    question: "どんな方からのご相談が多いですか？",
    answer:
      "奄美大島や離島エリアの中小事業者、観光・宿泊・特産品など地域の事業者さまからのご相談が中心です。「ホームページを作りたい」「予約や在庫の管理が大変」「ロゴや名刺も整えたい」など、内容が固まっていない段階でもお気軽にどうぞ。",
  },
  {
    id: "about-amami",
    category: "about",
    question: "なぜ奄美大島に拠点を置いているのですか？",
    answer:
      "AMALINKは奄美大島で生まれたチームです。島の暮らしや事業のリアルな課題を身近に感じながら、デジタルで地域とつながる仕事をしたいという想いから始まりました。離島ならではの回線や運用のしやすさも、最初から設計に取り入れています。",
  },
  {
    id: "service-website",
    category: "services",
    question: "ホームページ制作をお願いできますか？",
    answer:
      "はい。お店や会社の紹介サイト、集客用のページなど、目的に合わせて制作します。スマホでも見やすいデザインはもちろん、管理画面からご自身で更新しやすい構成で制作します。",
  },
  {
    id: "service-amami-web",
    category: "services",
    question: "奄美大島でホームページ制作を依頼できる会社はありますか？",
    answer:
      "はい。合同会社AMALINK（AMALINK）は、鹿児島県奄美大島を拠点にホームページ制作を行う会社です。コーポレートサイト、集客サイト、リニューアルまで対応し、島内外からのオンライン相談も受け付けています。詳細は https://amalink.co.jp/web-production をご覧ください。",
  },
  {
    id: "service-amami-design",
    category: "services",
    question: "奄美大島でデザイン制作（奄美大島デザイン）を依頼できますか？",
    answer:
      "はい。AMALINKは奄美大島を拠点に、ロゴ・名刺・パンフレット・SNS用画像などのデザイン制作に対応しています。印刷手配から納品まで一気通貫で依頼でき、ホームページ制作とあわせたブランド統一も可能です。詳細は https://amalink.co.jp/design をご覧ください。",
  },
  {
    id: "service-system",
    category: "services",
    question: "システム開発も相談できますか？",
    answer:
      "はい。予約管理、在庫管理、問い合わせの整理など、日々の「手間」を減らすWebアプリや業務システムの開発も行っています。Excelや紙の運用から移行したい、といったご相談も歓迎です。",
  },
  {
    id: "service-design-only",
    category: "services",
    question: "ロゴや名刺など、デザインだけの依頼もできますか？",
    answer:
      "はい。ロゴマーク、名刺、パンフレット、SNS用の画像など、ビジュアルのみのご依頼も承っています。印刷の手配から納品まで一気通貫で対応でき、Web制作と合わせてブランド全体を整えたい場合もご相談いただけます。",
  },
  {
    id: "service-renewal",
    category: "services",
    question: "すでにあるホームページのリニューアルも相談できますか？",
    answer:
      "もちろんです。デザインの刷新、スマホ対応、更新しやすい構成への作り替え、表示速度の改善など、現状のサイトを活かしながら直したい点を一緒に整理します。",
  },
  {
    id: "service-tourism",
    category: "services",
    question: "観光・宿泊・飲食店向けのサイトも作れますか？",
    answer:
      "はい。メニューやアクセス、予約・問い合わせ導線、InstagramなどSNSとの連携など、お客さまが実際に使いやすい構成を意識して制作します。季節やイベント情報を更新しやすい設計にも対応できます。",
  },
  {
    id: "service-small-start",
    category: "services",
    question: "小さく始めたいのですが、1ページだけでもお願いできますか？",
    answer:
      "可能です。最初は必要最低限のページ数で始めて、あとから内容を増やしていく進め方もよくあります。予算や目的に合わせて、無理のない範囲をご提案します。",
  },
  {
    id: "service-geo-what",
    category: "services",
    question: "GEO対策とは何ですか？",
    answer:
      "GEO（Generative Engine Optimization）とは、ChatGPTなどのAIが回答を作る際に、あなたの会社やサービスが正しく紹介・引用されやすくするための対策です。従来の検索順位だけでなく、「AIの答えの中に名前が出るか」も重要になってきています。",
  },
  {
    id: "service-geo-scope",
    category: "services",
    question: "GEO対策では具体的に何をしてくれますか？",
    answer:
      "事業内容がAIに正確に伝わるよう、サイトの文章構成・FAQ・会社情報の整理、構造化データ（JSON-LD）やllms.txtの整備など、Webページ全体の設計と改善を行います。新規制作と合わせることも、既存サイトの見直しだけでもご相談いただけます。",
  },
  {
    id: "service-geo-existing",
    category: "services",
    question: "すでにあるホームページのGEO改善だけお願いできますか？",
    answer:
      "はい。リニューアルを伴わず、情報の整理・FAQ追加・メタデータや構造化データの改善など、現状のサイトを活かしたGEO対策のみのご依頼も可能です。ただし、WixやSTORESなどノーコードで作られたサイトは、プラットフォームの仕様次第で構造化データの追加や細かなHTML調整ができない場合があります。その場合は「できる範囲での改善」か「作り直し」のどちらがよいか、現状を確認したうえで正直にお伝えします。",
  },
  {
    id: "service-geo-seo",
    category: "services",
    question: "SEO対策とGEO対策は違うのですか？",
    answer:
      "SEOはGoogleなどの検索結果で上位表示を目指す対策、GEOはAIが生成する回答の中で引用・紹介されやすくする対策です。どちらも「見つけてもらう」ことが目的ですが、AI検索が増える今は両方を意識したWeb設計が有効です。AMALINKでは制作とあわせて、両方の視点を取り入れたご提案が可能です。",
  },
  {
    id: "service-ai-consulting",
    category: "services",
    question: "AIコンサルティングでは何をしてくれますか？",
    answer:
      "ChatGPT・Claude の活用支援に加え、社内マニュアルや会社情報に特化した社内用チャットボットの制作にも対応します。Dify などの基盤を使う場合もありますが、古い手段に固定せず、その時点で実用的な形を選びます。詳細は https://amalink.co.jp/ai-consulting をご覧ください。",
  },
  {
    id: "service-chatbot",
    category: "services",
    question: "AIアバターチャットボットとは何ですか？",
    answer:
      "サイト上に表示されるキャラクター付きの案内チャットです。よくある質問への回答や、問い合わせへの橋渡しを自動化できます。AMALINKでは、答える範囲・見た目・導線を合わせて制作・組み込みもご相談いただけます。",
  },
  {
    id: "service-chatbot-scope",
    category: "services",
    question: "チャットボットは何でも答えてくれますか？",
    answer:
      "いいえ。答える範囲をあらかじめ決めて設計します。「自社サービスと地域のことだけ」など、用途に合わせて制限できます。",
  },
  {
    id: "process-area",
    category: "process",
    question: "奄美大島以外からも依頼できますか？",
    answer:
      "対応できます。拠点は鹿児島県奄美大島ですが、奄美群・鹿児島県内はもちろん、全国からのご依頼もオンラインでお受けしています。打合せや制作はリモートで進められますので、離島・本土を問わずお気軽にご相談ください。",
  },
  {
    id: "process-price",
    category: "process",
    question: "料金の目安を教えてください。",
    answer:
      "ページ数や機能、デザインの範囲によって異なります。まだ具体的なイメージが固まっていない段階でも、概算のご相談を承っています。お問い合わせフォームまたは公式LINEよりご連絡ください。",
  },
  {
    id: "process-timeline",
    category: "process",
    question: "制作にはどのくらいの期間がかかりますか？",
    answer:
      "内容やページ数、素材の準備状況によって変わります。シンプルなサイトなら数週間、機能やページが増えるほど長くなる傾向があります。ヒアリング後に、目安のスケジュールをお伝えします。",
  },
  {
    id: "process-flow",
    category: "process",
    question: "制作の流れを教えてください。",
    answer:
      "まずはヒアリング（対面またはオンライン）で目的やご予算感を確認し、必要に応じてお見積もりをご提示します。内容にご納得いただけましたら制作に入り、納品時には操作のご説明や更新方法のお渡しも行います。",
  },
  {
    id: "process-materials",
    category: "process",
    question: "写真や文章の準備がなくても大丈夫ですか？",
    answer:
      "大丈夫です。文章の整理や構成づくりのお手伝い、写真の選び方・撮影のご相談も可能です。素材が少ない場合は、シンプルな構成から始める方法もご提案します。",
  },
  {
    id: "process-meeting",
    category: "process",
    question: "打合せはどのように行いますか？",
    answer:
      "対面、オンライン（Zoom等）、公式LINEやメールでのやりとりなど、ご都合に合わせて選べます。離島・全国からのご相談でも、普段の業務の合間に進めやすいペースを大切にしています。",
  },
  {
    id: "process-undecided",
    category: "process",
    question: "まだ具体的な内容が決まっていなくても相談できますか？",
    answer:
      "はい、むしろそういった段階でのご相談が多いです。「なんとなくホームページが欲しい」「何から始めればいいかわからない」といった状態でも、一緒に整理していきます。",
  },
  {
    id: "support-after",
    category: "support",
    question: "納品後の更新やサポートはありますか？",
    answer:
      "ご自身で更新できるよう、操作レクチャーや簡易マニュアルをお渡しします。更新作業の代行や、保守・改善の継続サポートも、必要に応じてご相談いただけます。",
  },
  {
    id: "support-cms",
    category: "support",
    question: "自分で更新できるサイトにできますか？",
    answer:
      "はい。専用の管理画面を使えば、お知らせやブログ記事の更新はご自身で行えます。メニューや写真の差し替えも同様です。納品時に操作方法をお伝えしますので、はじめての方でも安心して運用していただけます。",
  },
  {
    id: "support-sns-only",
    category: "support",
    question: "SNS（Instagram等）だけでは足りませんか？",
    answer:
      "SNSは日々の発信に向いていますが、会社やお店の基本情報、サービス内容、問い合わせ導線などをまとめておく「拠点」としてホームページがあると、初めて知った方にも伝わりやすくなります。SNSと組み合わせる使い方がおすすめです。",
  },
  {
    id: "support-response",
    category: "support",
    question: "問い合わせ後、どのくらいで返信がありますか？",
    answer:
      "通常2営業日以内を目安にご返信しています。お急ぎの場合は、その旨をお問い合わせ内容に書いていただけると助かります。",
  },
];

export const KEY_URLS = {
  home: absoluteUrl("/"),
  faq: absoluteUrl("/faq"),
  contact: absoluteUrl("/contact"),
  news: absoluteUrl("/news"),
  services: absoluteUrl("/system-development"),
  about: absoluteUrl("/#about"),
} as const;
