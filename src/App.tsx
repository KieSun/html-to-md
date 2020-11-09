import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import styled from 'styled-components';
import TurndownService from 'turndown';
import { tables } from 'turndown-plugin-gfm'

const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
  bulletListMarker: '-',
});
turndownService.use(tables as any)
turndownService.addRule('removeCopy', {
  filter: 'pre',
  replacement: (content, node, options) => {
    if (node.children.length === 0) return content;
    return `${options.fence} ${node.children[0].getAttribute('lang')}
${content}
${options.fence}
    `;
  },
});

turndownService.addRule('style', {
  filter: 'style',
  replacement: (content, node, options) => {
    return ''
  },
});

function cleanAttribute (attribute: any) {
  return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
}

turndownService.addRule('img', {
  filter: 'img',

  replacement: function (content, node) {
    const n = node as HTMLElement
    const alt = cleanAttribute(n.getAttribute('alt'))
    const src = n.getAttribute('src') || ''
    const dataSrc = n.getAttribute('data-src')
    const title = cleanAttribute(n.getAttribute('title'))
    const titlePart = title ? ' "' + title + '"' : ''
    return src ? `![](${dataSrc || src + titlePart})` : ''
  }
});

turndownService.addRule('table', {
  filter: 'table',

  replacement: function (content, node) {
    console.log(content, node);
    return content
  }
});

turndownService.remove((node) => {
  return node.className === 'copy-code-btn';
});

const StyledWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const StyledLeft = styled.div`
  width: 50%;
  height: 100%;
  padding: 10px;
`;

const StyledRight = styled.div`
  width: 50%;
  height: 100%;
  background: aquamarine;
  padding: 10px;
`;

function App() {
  const [text, setText] = useState('');
  const handleChange = (instance: any) => {
    setText(turndownService.turndown(instance.getValue()));
  };
  return (
    <StyledWrapper>
      <StyledLeft>
        <CodeMirror
          options={{
            theme: 'md-mirror',
            keyMap: 'sublime',
            mode: 'markdown',
            lineWrapping: true,
            lineNumbers: false,
          }}
          onChange={handleChange}
        />
      </StyledLeft>
      <StyledRight>
        <CodeMirror
          value={text}
          options={{
            theme: 'md-mirror',
            keyMap: 'sublime',
            mode: 'markdown',
            lineWrapping: true,
            lineNumbers: false,
          }}
        />
      </StyledRight>
    </StyledWrapper>
  );
}

export default App;
