import * as React from 'react';

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import { TreeView } from '@mui/x-tree-view/TreeView';
// import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { DocumentPage } from '../../../common/types';
import { useDocumentAction, useGetDocumentPageAction } from '../documentState';
import { Button } from '@mui/material';
import TreeViewItem from './TreeViewItem';
import { useCallback, useState } from 'react';
import { TreeView } from '@mui/x-tree-view';
import { Folder, FolderOpen, Layers } from '@mui/icons-material';

export default function TreeViewer() {

  const getDocActions = useGetDocumentPageAction();
  const docActions = useDocumentAction();

  const [lastClickTime, setLastClickTime] = useState<Date | undefined>(undefined);
  const [lastSelectedNode, setLastSelectedNode] = useState<string>("");

  const [expanded, setExpanded] = useState<string[]>([]);

  const documentPageIds = getDocActions.documentIds;

  const test = (nest: number, c?: DocumentPage) => {

    // if (nest > 5) return;

    // for (let ii = 0; ii < 5; ii++) {

    //   const id = crypto.randomUUID();
    //   const a = bb.newDocumentPage(id, "html", id, c ? c.id : undefined);
    //   const max = 3;

    //   console.log(ii);

    //   for (let i = 0; i < max; i++) {
    //     test(nest++, a);
    //   }
    // }
    const id = crypto.randomUUID();
    const a = docActions.newDocumentPage(
      {
        id, 
        title: id,
        contentType: "html", 
        content: `<span style="color:red;"><strong>${id}</strong></span>`, 
        parentId: c ? c.id : undefined,
      });
    
    return ;
  }
  
  const clickHandler = useCallback((event: React.SyntheticEvent, nodeId: string) => {
  
    setLastClickTime(oldDate => {

      if (oldDate == undefined) return new Date();
    
      const date = new Date();
      const isOpening = !expanded.includes(nodeId);

      if (nodeId == lastSelectedNode && (date.getTime() - oldDate.getTime() <= 300)) { 

        if (isOpening) {
          setExpanded(nodes => [...nodes, nodeId]);          
        }
        else {
          setExpanded(nodes => nodes.filter(id => id != nodeId));
        }
      }  

      return new Date();
    });

    setLastSelectedNode(nodeId);
    
    docActions.setSelectionDocumentPage(nodeId);

  }, [expanded, lastSelectedNode]);

  const toggleHandler = useCallback((event: React.SyntheticEvent<Element, Event>, nodeIds: string[]) => {
    // setExpanded(nodeIds);
  }, []);

  const selDivId = getDocActions.selectedDivisionId;

  const idList = Object.keys(documentPageIds)
  .filter(id => (selDivId && (selDivId == id || documentPageIds[id].parentId != undefined) || selDivId == undefined))

  console.log(idList);

  return (
    <>
      {/* <Box sx={{ overflow: "auto", flexGrow: 1, minWidth: "300px" }}> */}
      {/* <Button onClick={click}>aaaaaa</Button> */}
      <TreeView 
      expanded={expanded}
      multiSelect={false} 
      onNodeToggle={toggleHandler} 
      onNodeSelect={clickHandler}
      defaultCollapseIcon={<Folder />}
      defaultExpandIcon={<FolderOpen />}

        // defaultCollapseIcon={<ExpandMoreIcon />}
        // defaultExpandIcon={<ChevronRightIcon />} 
      >
        { 
          idList.map(id => <TreeViewItem key={id} documentPageId={id} parentId={ selDivId ? selDivId : undefined }></TreeViewItem>) 
        }
      </TreeView>
    {/* </Box> */}
    </>

  );
}