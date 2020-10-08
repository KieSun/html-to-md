import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import styled from 'styled-components';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
  bulletListMarker: '-',
});
turndownService.addRule('removeCopy', {
  filter: (node) => {
    return node.nodeName === 'PRE';
  },
  replacement: (content, node, options) => {
    if (node.children.length === 0) return content;
    return `${options.fence} ${node.children[0].getAttribute('lang')}
${content}
${options.fence}
    `;
  },
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
