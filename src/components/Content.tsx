import { EditorState } from '@codemirror/state';
import PCRE from 'pcre-to-regexp';
import 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import toaster, { Toaster } from 'solid-toast';
import Card from './Card';
import './Content.scss';
import { createEditor } from './codemirror/Codemirror';
import Visualizaiton from './Visualization';

function PlayIcon() {
  return (
    <svg 
      class='play-icon' 
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg">
        <path d="M112,111V401c0,17.44,17,28.52,31,20.16l247.9-148.37c12.12-7.25,12.12-26.33,0-33.58L143,90.84C129,82.48,112,93.56,112,111Z" />
      </svg>
  );
}


function RegulexController() {
  let [regex, setRegex] = createSignal("/([A-Z])\w+/g");
  let [matches, setMatches] = createSignal([]);
  let [matchString, setMatchString] = createSignal('test');
  let [expression, setExpresison] = createSignal('');
  async function postRequest() {
    const payload = await fetch('/api/bot', {
      method: 'POST',
      body: JSON.stringify({
        query: expression()
      }),
    });
    return await payload.json();
  }
  const { ref: expressionRef, editorView } = createEditor({
    value: regex(),
    oneLine: true,
    readOnly: true,
  });
  const handleAnalyze = async (e: MouseEvent) => {
    try {
      e.preventDefault();
      const response = await postRequest()
      toaster.success('Succesfuly created regular expression.');
      setRegex(response.regexp);
      const state = EditorState.create({
        ...editorView()?.state,
        doc: response.regexp,
      });
      editorView()?.setState(state);
    } catch (e) {
      toaster.error('Error during creation: ' + (e as Error).message);
    }
  }

  async function setCurrentQuery(query: string) {
    setExpresison(query);
    const response = await postRequest()
    setExpresison(response.regexp);
    toaster('Build from history.');
  }
  createEffect(() => {
    try {
      let visualizeRegex;

      setMatches([]);
      try {
        visualizeRegex = PCRE(regex(), []);
      } catch (e) {
        visualizeRegex = new RegExp(regex());
      }
      let m;
      const tempMatches: RegExpExecArray[] = [];
      const string = matchString();
      while ((m = visualizeRegex.exec(string)) !== null) {
        if (m.index === visualizeRegex.lastIndex) {
          visualizeRegex.lastIndex++;
        }
        tempMatches.push(m);
      }
      setMatches(tempMatches);
    } catch (e) {
      console.log(e)
    }
  }, []);
  const { ref: editorMachRef } = createEditor({
    // The initial value of the editor
    value: matchString(),
    enableTabKey: true,
    onValueChange: (value) => setMatchString(value),
  });
  const { ref: generatorRef } = createEditor({
    value: expression(),
    placholder: 'Write description what u need to match by regular expression',
    onValueChange: (value) => setExpresison(value),
  });

  function getMatchText(length: number) {
    if (length === 0) {
      return 'No matches'
    } else if (length === 1) {
      return length + ' match'
    }
    return length + ' matches'
  }
  return (
    <div class='content'>
      <Card
        title=''
        sectionClassName='generator'
        header=''
      >
        <article class='editor multiline' ref={generatorRef} />
      </Card>
      <Card
        sectionClassName='expression'
        title=''
        header={<button onClick={(event) => handleAnalyze(event)}><span class='generate--text'>{PlayIcon()}</span></button>}
      >

        <div class="editor" ref={expressionRef} />
      </Card>
      <Card
        sectionClassName='matches'
        title='Matches'
        header={<h2> {getMatchText(matches().length)}</h2>}
      >
        <article class="editor multiline" ref={editorMachRef} />
      </Card>
      <Card
        sectionClassName='visualize'
        title='Visualize'
      >
        <Visualizaiton regex={regex} />
      </Card>
      <slot />
      <Toaster position="bottom-center"
        gutter={8} />
    </div>
  );
};

export default RegulexController;
