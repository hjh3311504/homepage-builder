import React, { useRef } from 'react';
import { Editor as TinyEditor } from '@tinymce/tinymce-react';

const TextEditor = () => {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <>
      <TinyEditor
        onInit={(event, editor) => {
          editorRef.current = editor;
        }}
        apiKey="7jkf74v8f5hnkllkf8j17tqy2tbk1akqq2ve1vl8lrcu24no"
        initialValue="<p>This is the initial content of the editor.</p> <h1>젊은 피가 끓는 해~병~</h1>"
        init={{
          language: 'ko_KR',
          menubar: false,
          inline: true,
          plugins: ['link', 'lists', 'powerpaste', 'autolink'],
          toolbar: [
            'undo redo | bold italic underline | fontselect fontsizeselect',
            'forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent',
          ],
          valid_elements:
            'p[style],strong,em,span[style],a[href],ul,ol,li, img',
          valid_styles: {
            '*': 'font-size,font-family,color,text-decoration,text-align',
          },
          powerpaste_word_import: 'clean',
          powerpaste_html_import: 'clean',
        }}
      />
      <button onClick={log} type="button">
        Log editor content
      </button>
    </>
  );
};

export default TextEditor;
