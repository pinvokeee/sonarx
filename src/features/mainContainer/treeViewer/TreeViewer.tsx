import * as React from 'react';

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import { TreeView } from '@mui/x-tree-view/TreeView';
// import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { DocumentPage } from '../../../common/types';
import { Box, Button, styled } from '@mui/material';
import TreeViewItem from './TreeViewItem';
import { useCallback, useEffect, useState } from 'react';
import { TreeView } from '@mui/x-tree-view';
import { Folder, FolderOpen, Layers } from '@mui/icons-material';
import { useDocumentSetterActions, useDocuments } from '../../../common/states/document';

const StyledTreeViewBox = styled(TreeView)(({theme}) => ({
  borderRight: "1px solid #e0e0e0",
  overflow: "auto",
  flexGrow: 1,
  minWidth: "300px"
}));

const getParentsId = (id: string | undefined, pages: { [key: string]: DocumentPage }) : string[] => {

  if (!pages[id as string]) return [];

  const parents = [];
  let pid = pages[id as string].parentId;

  while (pid) {
    parents.push(pid);
    pid = pages[pid].parentId;
  }

  return parents;
};

export default function TreeViewer() {

  const documents = useDocuments();
  const actions = useDocumentSetterActions();

  const [expanded, setExpanded] = useState<string[]>([]);
  const [lastClickTime, setLastClickTime] = useState<Date | undefined>(undefined);
  const [lastSelectedNode, setLastSelectedNode] = useState<string>("");

  const selDocId = documents.selectedPageId;
  const pages = documents.pages;
  
  const divisionId = documents.selectedDivisionId;
  const idList = Object.keys(pages).filter(id => (divisionId && (divisionId == id || pages[id].parentId != undefined) || divisionId == undefined))

  useEffect(() => setExpanded(getParentsId(selDocId, pages)), []);

  //ツリーノードをクリックした際のイベント
  const clickHandler = useCallback((event: React.SyntheticEvent, nodeId: string) => {

    // if (typeof nodeId !== "string") return;

    setLastClickTime(oldDate => {
      
      if (oldDate == undefined) return new Date();
      
      const date = new Date();
      const isOpening = !expanded.includes(nodeId);

      if (nodeId == lastSelectedNode && (date.getTime() - oldDate.getTime() <= 300)) {
        setExpanded(nodes => isOpening ? [...nodes, nodeId] : nodes.filter(id => id != nodeId));
      }

      return date;
    });

    setLastSelectedNode(nodeId);

    actions.setSelectionDocumentPage(nodeId);

  }, [expanded, lastSelectedNode]);

  return (
    <>
      <StyledTreeViewBox>
        <TreeView
          defaultSelected={selDocId}
          expanded={expanded}
          multiSelect={false}
          onNodeSelect={clickHandler}
          defaultCollapseIcon={<Folder />}
          defaultExpandIcon={<FolderOpen />}
        >
          {
            idList.map(id => <TreeViewItem key={id} documentPageId={id} parentId={divisionId ? divisionId : undefined}></TreeViewItem>)
          }
        </TreeView>
      </StyledTreeViewBox>
    </>

  );
}