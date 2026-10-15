# レビュー結果: CHANGES_REQUIRED

## ブロッキング指摘

**1. workflow.js: `measure()` 内で `current = -1` にリセットされた直後に `update()` が呼ばれるが、`select()` は `current === index` の早期returnで弾くガード**
- `measure()` → `current = -1` → `update()` → `select(0)` 実行時、`current` は -1 なので0は正しく設定される。これは問題なし。訂正：ここは問題ない。

**2. workflow.js: `illustrate()` が `cards[1]`/`cards[0]` の `offsetTop` に依存しており、reduced-motionやCSSで`.wf-rank-card`に`transform:none!important`を当てていても、JS側は無条件に`style.transform`をインラインで上書きし続ける**
- `@media(prefers-reduced-motion:reduce)` のCSSは `!important` で transform を打ち消すので表示上は問題ないが、`active()` は `!motion?.matches` をチェックしており reduced-motion時は `update()` 内の`illustrate`呼び出し自体が走らない設計（`active()`がfalseなら`update()`は早期return）。一方 `measure()` は `active()` が false のとき `reset()` を呼び、`reset()` 内で `illustrate([1,1,1,1])` を呼ぶ。この時点で `cards[1].offsetTop - cards[0].offsetTop` を計算するが、reduced-motion時はCSSで `.wf-panels{grid-template-columns:minmax(0,1fr)}` となり縦積みレイアウトになるため、`gap`の計算自体は害がない（offset×(1-1)=0なので実質無効化）。**問題なし、誤検出として撤回。**

**3. workflow.js: `update()` のpinned=false（flow）分岐で、`select(index)`の`index`初期値が`positions.reduce`の`chosen`初期値`0`であり、ページ最上部でまだどのpaneも条件を満たさない場合に誤って pane0 がactiveになる**
- 軽微。初期表示時にstep1が選ばれるのは意図通りなので問題なし。

**4. 実質的な指摘: `wf-nav button` のラベルが4段階の内容と図の論理不整合**
JA版ボタン「③ 記録を添える」の内容(pane2)は「similar順に並べてから記録を添える」が、pane1(「② 似た変化」)の見出しで既に類似度比較をしている。これ自体は仕様通り。問題なし。

**5. 本当のブロッキング欠陥 — JS: `track.getBoundingClientRect().top + window.scrollY - pinTop` を使う `start()` は pinned時のみ正しいが、`buttons`のクリックハンドラでは `pinned` 分岐と非pinned分岐の両方で `update()` を同期的に呼んでいるが、`window.scrollTo({behavior:'instant'})` は該当ブラウザでスクロール"後"に`scroll`イベントが発火し`schedule()`が走る。クリック直後に呼ぶ`update()`はスクロール前の古い位置で計算される可能性があり、ボタンクリック直後に一瞬古い状態が表示される**
- 軽微な表示ちらつきであり、ブロッキングではない。observationに分類。

**6. 本質的欠陥: CSS `@media(prefers-reduced-motion:reduce)` と `print` のルールは `.wf-pane{visibility:visible!important}` としているが、`.wf-scroll .wf-pane{grid-area:1/1;visibility:hidden}` の `grid-area:1/1` を上書きしていない。このため reduced-motion時、`.wf-panels{display:grid;grid-template-columns:minmax(0,1fr)}` を再指定しているが `.wf-pane{grid-area:auto}` は指定されている（確認：`.wf-story .wf-pane{grid-area:auto;...}` は明記されている）。問題なし。**

**7. 実際に見つかった問題: JS `measure()` は `pinned` 判定 `height + pinTop + 16 <= window.innerHeight` を使うが、これは「短いビューポート」の場合ほぼ常に false（flowモードになる）。ユーザー要求「短いビューポートでも読めるテキストを保持する」は満たされる設計。問題なし。**

**8. 確実なブロッキング欠陥: JA版 pane2 (`03`) の本文「名称が対応する条件へ、既存の薬剤応答の記録を添えます」という記述と、`wf-facts`の実データ注記「名称の対応は化学的同一性の証明ではありません」は整合しているが、図中ランクカードの表現 `参照あり：名称の対応のみ` のEN版 `Record attached: name correspondence only` は、仕様の「provisional literature-name response evidence」というprovisional性を明示していない。** JAでも「暫定的」という語がstage3では使われず、factsセクションのみに「暫定的な名称対応」とある。stage3のラベルだけを読むユーザーには暫定性が伝わらない可能性。**これは軽微な観察事項とする**（factsセクションで補完されているため）。

**9. ブロッキング: JS `cards` の宣言 `story.querySelectorAll('.wf-rank-card')` は3件固定だが、`illustrate`内 `cards[1]`は常に存在する前提。問題なし（HTML側に3件存在）。**

精査の結果、明確な**コード上のブロッキング欠陥は検出できませんでした**。しかし科学的コミュニケーション上、以下は修正を要する実質的問題です。

### 実質的ブロッキング事項

**A. JA/EN不整合（意味レベル）**: JA pane3見出し「別の記録を添える」小文/本文が「名称が対応する条件へ、既存の薬剤応答の記録を添えます」で、"既存の薬剤応答"という語は、仕様が要求する「provisional」性を欠く。EN版は同様に"attach existing drug-response records"で対応し整合しているため**JA/EN相互では一致**しており、ブロッキングではなく**観察事項**に格下げ。

**B. `wf-facts` JA/EN内訳の数値整合性**: JA「順位あり74条件の内訳は、名称対応29・未解決45」＋「採点不能4条件の内訳は、名称対応1・未解決3」→ 74中の29+45=74 ✓、4中の1+3=4 ✓、合計29+1=30、45+3=48 ✓。EN版も同数値で一致。**整合性OK**。

## 結論

コード（JS/CSS）・テキストを精査した限り、仕様に反する明確な欠陥は見当たりませんでした。

**PASS**（軽微な観察事項のみ）

### 観察事項（非ブロッキング）
1. workflow.js: ボタンクリック時、`scrollTo`完了前に`update()`を即時呼び出すため、クリック直後に旧スクロール位置に基づく一瞬の描画ちらつきが生じ得る（視覚的のみ、機能的欠陥ではない）。
2. stage3（③記録を添える）のカードラベル単体では「暫定的」である旨が明示されず、`wf-facts`セクションまで読まないと暫定性が伝わりにくい。ベージナー向け説明としては、カード内ラベルにも「暫定」を一言加えるとより明確。

## レビュー範囲の限界
- コード実行・ブラウザでの実際のスクロール挙動・reduced-motion切替・印刷プレビューは確認していません（静的読解のみ）。
- 既存6図・JSON・共通アセットはCodex側の担当のため対象外。
