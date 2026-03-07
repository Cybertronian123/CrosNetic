import { Editor } from "./editor/Editor";
import { EditorStoreProvider } from "./state";

export default function App() {
  return (
    <EditorStoreProvider>
      <Editor />
    </EditorStoreProvider>
  );
}
