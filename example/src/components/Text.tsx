import React from "react";

export default ({ text }: { text: string }) => (
  <div style={{ margin: "50px" }}>
    This is Text Component.
    <pre>{text}</pre>
  </div>
);
