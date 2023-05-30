
import {
    Accessor,
    createEffect,
    createSignal,
    on,
    onCleanup,
    onMount,
  } from 'solid-js';
  import { Decoration, DecorationSet, EditorView, MatchDecorator, Panel, ViewPlugin, ViewUpdate,WidgetType,highlightWhitespace, keymap, placeholder } from '@codemirror/view';
  import { EditorState, Extension,Compartment } from '@codemirror/state';
  import { createCompartmentExtension as coreCreateCompartmentExtension } from './createCompartmentExtension';
  import {minimalSetup  } from "codemirror"

  export interface CreateCodeMirrorProps {
    /**
     * The initial value of the editor
     */
    value: string;
    oneLine?: boolean;
    enableTabKey?: boolean;
    readOnly?: boolean
    showMatches?: boolean,
    placholder?: string,
    /**
     * Fired whenever the editor code value changes.
     */
    onValueChange: (value: string) => void;
    /**
     * Fired whenever a change occurs to the document. There is a certain difference with `onChange`.
     */
    onModelViewUpdate: (vu: ViewUpdate) => void;
  }
  
  /**
   * Creates a CodeMirror editor instance.
   */
  export function createEditor(props?: Partial<CreateCodeMirrorProps>) {
    const [ref, setRef] = createSignal<HTMLElement>();
    const [editorView, setEditorView] = createSignal<EditorView>();
  
    function localCreateCompartmentExtension(
      extension: Extension | Accessor<Extension | undefined>
    ) {
      return coreCreateCompartmentExtension(extension, editorView);
    }
  
    const updateListener = EditorView.updateListener.of((vu) =>
      props?.onModelViewUpdate?.(vu)
    );
  
    // eslint-disable-next-line solid/reactivity
    localCreateCompartmentExtension(updateListener);
  
    createEffect(
      on(ref, (ref) => {
        let tabSize = new Compartment
        
        const fixedHeightEditor = EditorView.theme({
          "&": {height: "100%",width: '100%'},
          ".cm-scroller": {overflow: "auto"},
          "&.cm-editor.cm-focused": {
            outline: "none"
        }
        });

        
        const extensions = [];
        if(props?.oneLine)  {
          extensions.push(
            EditorState.transactionFilter.of(tr => tr.newDoc.lines > 1 ? [] : tr),
          )
        }

        if(props?.readOnly)  {
          extensions.push(
            EditorState.readOnly.of(true),
          )
        }
        if(props?.placholder) {
          extensions.push(
            placeholder(props?.placholder),
          );  
        }
        if(props?.showMatches) {
          class CheckboxWidget extends WidgetType {
            constructor(readonly text: string) { super() }
          
            toDOM() {
              let wrap = document.createElement("span")
              wrap.className = "match"
              wrap.innerText = this.text;
              return wrap
            }
          
            ignoreEvent() { return false }
          }
          const placeholderMatcher = new MatchDecorator({
            regexp: /test/g,
            decoration: match => Decoration.replace({
              widget: new CheckboxWidget(match[0]),
            })
          })
          const matchExtension = ViewPlugin.fromClass(class {
            placeholders: DecorationSet
            constructor(view: EditorView) {
              this.placeholders = placeholderMatcher.createDeco(view)
            }
            update(update: ViewUpdate) {
              this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders)
            }
          }, {
            decorations: instance => instance.placeholders,
            provide: plugin => EditorView.atomicRanges.of(view => {
              return view.plugin(plugin)?.placeholders || Decoration.none
            })
          })  
          extensions.push(matchExtension);
        }

       
        const state = EditorState.create({ 
          doc: props?.value ?? '',
          extensions: [
            ...extensions,
            minimalSetup,
            EditorState.allowMultipleSelections.of(true),
            highlightWhitespace(),
            tabSize.of(EditorState.tabSize.of(4)),
            fixedHeightEditor,
            EditorView.lineWrapping,
          ],
        });
      
        const currentView = new EditorView({
          state,
          parent: ref,
          // Replace the old `updateListenerExtension`
          dispatch: (transaction) => {
            currentView.update([transaction]);
            if (transaction.docChanged) {
              const document = transaction.state.doc;
              const value = document.toString();
              props?.onValueChange?.(value);
            }
          },
        });

        onMount(() => setEditorView(currentView));
  
        onCleanup(() => {
          editorView()?.destroy();
          setEditorView(undefined);
        });
      })
    );

  
    createEffect(
      on(
        editorView,
        (editorView) => {
          const localValue = editorView?.state.doc.toString();
          if (localValue !== props?.value && !!editorView) {
            editorView.dispatch({
              changes: {
                from: 0,
                to: localValue?.length,
                insert: props?.value ?? '',
              },
            });
          }
        },
        { defer: true }
      )
    );
  
    return {
      editorView,
      ref: setRef,
      createExtension: localCreateCompartmentExtension,
    } as const;
  }
