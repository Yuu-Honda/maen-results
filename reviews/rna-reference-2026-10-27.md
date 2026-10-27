# RNA reference-pair diagnostic — review and publication scope

2026-10-27。保存済みスコアだけの開発診断です。6問い合わせ等重みの単独1位率は実RNA55.6%、旧遺伝子入替え1通り65.7%、一定ラベル基準50.0%。両者の補助集計は17/28。同じ6問い合わせの組み替えで、独立な28実験ではありません。

実行前に独立Codexと実際のAnthropic Claudeが同じ22ファイルを点検し、固定commitのpushとGitHub照合後に1回実行。別実装で1,765項目が一致、数値最大差0。全642テスト成功。公開前は同じ29ファイル対応表を再検査し、両者最終PASSでした。Claudeの表示モデルはOpus5.5（中）、静的読み取りのみで、テストやhash再計算・ブラウザ操作を実行したとは扱いません。

公開前に直した点：metadataで0となる範囲を「各source群内に両成分が同条件で揃う2群ペア」に限定し、無向pairと向き付き割当てを区別。単一入替えは帰無分布/p値ではないこと、1pairだけの2/6queryで安定性が自動成立すること、集計から文脈別の値を算術推定できることも明記しました。

- Final publication manifest SHA256: `a8b10e600a225d808383ca91d2c3114854751e7256c7fa5da7f7bfb88fd3d4ea`
- Public diagnostic JSON SHA256: `cee3d0d3345d9b2e5425c56a5a192d0ef8723d794d9e8fe86a5489c2bcac0243`
- Metadata availability JSON SHA256: `a083300605990177c639cb4b12b6c6d2e724ed7d6c695832040e15ba152908fc`

日英32表示条件+2印刷、修正文言の最終6条件、22local linksを確認。既存のスクロールで進む/戻る/止まる操作、旧5RNA集計、CSS/JSを保持。追加section/navを除くと旧HTMLへbyte単位で戻り、公開集計から新sectionを同じ内容で再生成できます。公開物に個別ID/profile/score/rankやmargin極値は含めません。

This is a post-result diagnostic of saved scores, not independent biological validation or a demonstration of food/treatment efficacy. Three external GEO studies are metadata candidates only; no new numerical cohort was selected. The two-provider AI reviews do not replace expert peer review, independent experiments or clinical validation. Live deployment verification is a separate post-publication step. Full private source/review records and local input paths are not copied here.
