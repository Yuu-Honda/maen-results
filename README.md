# MAEN — 細胞の変化から、次に調べる候補へ

[日本語サイト](https://yuu-honda.github.io/maen-results/) / [English](https://yuu-honda.github.io/maen-results/en.html)

MAENは、細胞の実測データを使って仮説を絞る探索的な研究記録です。この公開リポジトリにはサイトのコード、方法の説明、数値の集計を置きます。計算用のコードは別の非公開リポジトリで管理しています。原表、全タンパク質・遺伝子プロファイル、個別条件の結果、用量表、細胞の割り当てや保留IDはここに配布しません。

## タンパク質の変化から投与条件を再発見する

MCF7乳がん細胞を処理12時間後に測定した公開研究を使います。78投与条件を、一方の生物学的反復のタンパク質量の変化から他方で検索し、逆方向も実行しました。正解は同じ物質・同じ用量の条件です。測定されたタンパク質量を比べるもので、結合や活性を直接測りません。

| 検索方法 | 1位で再発見 | 5位以内で再発見 | MRR |
|---|---:|---:|---:|
| 実測のタンパク質変化 | 109/156（69.9%） | 149/156（95.5%） | 0.79991 |
| 欠損位置だけ | 26/156（16.7%） | 118/156（75.6%） | 0.38630 |
| 観測値を入れ替え | 1/156（0.6%） | 10/156（6.4%） | 0.06149 |
| ランダム順位の期待値 | 1.28% | 6.41% | 0.06334 |

MRRは正解順位の逆数の平均です。全156問い合わせで、正解を含む78候補すべてを採点できました。欠損位置だけでも5位以内75.6%となるため、測定グループの情報が検索の手掛かりになっています。同じ研究・共有DMSO対照に依存した反復であり、独立施設や未知物質での性能を証明する結果ではありません。観測値の入れ替えは1回の診断で、置換検定やp値ではありません。

著者が選別・使用済みの外部20署名も検索しました。候補があったのは19件、なかったのは1件です。物質名をカタログに対応できた11件だけで正解再発見を評価し、1位6/11、5位以内7/11でした。残る9件は物質同定が未確定かカタログに存在せず、正解率の分母に含めていません。この確認も未使用の独立最終検証ではありません。

手順は2026年10月6日、結果計算前のcommit `012e2c5`で固定しました。XLSX解析6.498秒、計算1.558秒で、取得・描画・JSON保存は含みません。41テスト成功はローカル実行の記録です。公開サイトは集計の閲覧と比較に対応し、任意の入力から物質を検索するバックエンドは公開していません。

[タンパク質検索の公開集計](data/protein-summary.json) / [原論文](https://doi.org/10.1016/j.jpha.2023.08.021) / [本文・方法](https://pmc.ncbi.nlm.nih.gov/articles/PMC10859532/) / [MS登録 PXD043263](https://proteomecentral.proteomexchange.org/cgi/GetDataset?ID=PXD043263)

本文はCC BY-NC-ND 4.0で、補足データ固有の別ライセンスは確認できていません。原Excel表や全派生行列は再配布せず、出典、MAENの方法説明、数値の集計を掲載します。S2の正の数値を薬剤/DMSOの量比と解釈したのは本文の方法に基づく仮定で、Excel見出しに単位が明記されているわけではありません。欠損は0に補完しません。

## RNA特徴から薬剤応答を予測する

以前から使っている44開発細胞・重複する20分割に、組織モデルの調整とRNA入れ替え対照を追加しました。MAEはpGI50の誤差で、小さいほど良い値です。

| モデル | 平均MAE |
|---|---:|
| 薬剤平均 | 0.60794 |
| 組織（係数10固定） | 0.59465 |
| 組織（学習内CV調整） | 0.61016 |
| 分子（RNA） | 0.55093 |
| RNAを入れ替えた分子対照 | 0.60766 |

分子モデルは調整組織モデルとRNA入れ替え対照のそれぞれに対して19/20分割でMAEが小さくなりました。この20分割は独立試行ではなく、有意差や因果効果を意味しません。RNA入れ替えは組織の情報も壊し、モデルの調整候補数も異なります。独立最終評価は未完了で、保留細胞は評価していません。

追加手順は計算前のcommit `ce5a4fb`で固定しました。キャッシュ解析と20分割評価は17.237秒、ダウンロード・描画・GitHub反映は除きます。21テスト成功はローカル実行で、CI実績ではありません。既存の3モデル・20分割の集計は変更せず保存しています。その旧評価では、依存コードと環境の追加固定は結果の後でした。

[追加対照の公開集計](data/controls-summary.json) / [旧3モデル・20分割集計](summary.json) / [以前の結果](history/2026-10-06-robust-20/index.html) / [CellMiner](https://discover.nci.nih.gov/cellminer/)

## 到達点と次の検証

今の到達点は、実測された細胞の変化から、次に調べる候補を絞るための比較です。未知物質の応答予測、正常細胞への回復、がん細胞だけへの選択毒性、人体での安全性や治療効果は評価していません。次に必要なのは、別施設・別細胞の摂動データ、物質構造と投与条件の対応、正常細胞とがん細胞を並べた測定、そして実験による検証です。

## English overview

MAEN records two exploratory research lines: RNA-based drug-response prediction and retrieval of measured treatment conditions from protein-abundance changes. The public repository contains website code, methods and numerical aggregates. Benchmark code is private; source workbooks, full profiles, individual conditions, doses and cell assignments are not redistributed.

Protein retrieval recovered the exact treatment condition at rank 1 in 109/156 queries and within the top 5 in 149/156. Missing-mask retrieval alone reached 118/156 in the top 5, showing that measurement-group information remains a strong clue. The two replicates share a study and DMSO controls. Of 20 previously selected literature signatures searched, 19 had candidates; identity accuracy used only the 11 mapped signatures, with 6 top-1 and 7 top-5 hits. This is not an independent final validation. The procedure was frozen before scoring; 41 tests passed locally.

The additional RNA comparison reused 44 previously viewed development cells over 20 overlapping splits. Mean MAE was 0.55093 for the molecular model, 0.61016 for the cross-validated tissue model and 0.60766 for the shuffled-RNA control. Split wins are descriptive, not independent trials or significance tests. The additional procedure was frozen before scoring; 21 tests passed locally. Independent final evaluation and therapeutic efficacy remain unverified.

**免責事項**：個人の趣味の研究記録で、コード・計算・文章は主にAIを使って作成しています。専門家の監修・査読はなく、正確性は保証しません。医療上の助言ではありません。NCIとは無関係です。[サイトの免責事項](https://yuu-honda.github.io/maen-results/#disclaimer)を参照してください。
