export const getOrCreateContextId = () => {
    var contextType = window.FBInstant.context.getType();
    var contextId = window.FBInstant.context.getID();
    if (contextType == "SOLO") {
      contextId = window.FBInstant.player.getID() + "_SOLO";
    }
    return contextId;
  }