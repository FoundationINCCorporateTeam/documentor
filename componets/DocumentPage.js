import React, { useState, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { WebsocketProvider } from 'y-websocket';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';
import { EditorState } from 'prosemirror-state';
import { schema } from 'prosemirror-schema-basic';

const DocumentEditor = ({ doc }) => {
  const editor = withReact(createEditor());
  const [value, setValue] = useState(EditorState.create({
    doc,
    plugins: [
      ySyncPlugin(editor.doc),
      yCursorPlugin(editor.doc.clientID),
      yUndoPlugin()
    ]
  }));

  useEffect(() => {
    editor.doc.on('update', () => {
      setValue(EditorState.create({
        doc: editor.doc,
        plugins: value.plugins
      }));
    });
  }, [editor]);

  return (
    <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
      <Editable />
    </Slate>
  );
};

const DocumentPage = () => {
  const [yDoc, setYDoc] = useState(null);

  useEffect(() => {
    const provider = new WebsocketProvider('ws://localhost:1234');
    const ydoc = provider.get('prosemirror', 'textarea');
    setYDoc(ydoc);
  }, []);

  return (
    <div>
      <h1>Document Editor</h1>
      {yDoc && <DocumentEditor doc={yDoc} />}
    </div>
  );
};

export default DocumentPage;
