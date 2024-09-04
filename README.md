# VSCode extension - Line Space Fill Trim

[![](https://vsmarketplacebadges.dev/version-short/SatoshiYamamoto.vscode-line-space-fill-trim.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-line-space-fill-trim)
[![](https://vsmarketplacebadges.dev/installs-short/SatoshiYamamoto.vscode-line-space-fill-trim.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-line-space-fill-trim)
[![](https://vsmarketplacebadges.dev/rating-short/SatoshiYamamoto.vscode-line-space-fill-trim.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-line-space-fill-trim)
[![](https://img.shields.io/github/license/standard-software/vscode-line-space-fill-trim.png)](https://github.com/standard-software/vscode-line-space-fill-trim/blob/main/LICENSE)

This extension has the following functions
- Fill end-of-line space for all selected lines.
- Fill end-of-line space for selected text lines.
- trim start is performed on selected lines.
- trim end is performed on selected lines.
- trim (start and end) is performed on selected lines.
- Cut min indentation for selected lines

## Install

https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-line-space-fill-trim

## Usage

Select multiple lines.
Execute the command.

```
- Line Space : Fill To End : Select All Lines
- Line Space : Fill To End : Select Text Lines
- Line Space : Trim Start
- Line Space : Trim End
- Line Space : Trim
- Line Space : Cut Min Indent
```

## operation

The number of spaces to be filled is done according to the maximum number of characters in the selection.
The number of characters is obtained by graphemesplit.

[graphemesplit - npm](https://www.npmjs.com/package/graphemesplit)  
Thanks to the author of graphemesplit.

So Japanese and Chinese kanji characters are counted as two characters of the alphabet.
Pictograms are also counted as two characters of the alphabet, and pictograms that are combined into a single character are also counted as two characters of the alphabet.

- A = 1 character width
- あ = 2 character width
- 😊 = 2 character width
- 👨‍👩‍👧‍👦 = 2 character width

