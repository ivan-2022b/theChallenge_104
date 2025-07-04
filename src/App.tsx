import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Node from './components/Node.tsx'
import Prefill from './components/Prefill.tsx'
import Modal from './components/Modal.tsx'

// Avantos.ai – Mon, 30 Jun 2025 19;33;23 GMT

function App() {
// INITIAL BP DESIGN

  // fetch data from http://localhost:3000/api/v1/0/actions/blueprints/0/graph, useEffect

 /* general goals:
 – accomodate any combination of form data sources
 – be accessible to users w/o need to change code
 – support new, future form data sources
 */

// REACT BP DESIGN

 /* components:
 – dynamic form/node w/ props from the fetched data
 – prefill UI w/ props from the selected form/node component
 – view/edit web modal w/ props from the selected form/node component
 */

 //              App() ... all nodes, one state that includes selected node & whether modal for a specific field is open
 //        /       |       \ ... renders
 // form/node  prefill UI  web modal

 /* state:
 – form/node data
 – isSelected: boolean (of all nodes, only 0-1 may have true value)
 – modalOpened: "checkboxGroup" | "object" | "email" | undefined
 */

 type FormNode = {
  id: string
    data: {
        id: string,
        component_key: string,
        component_type: string,
        component_id: string,
        name: string
    }
    position: {
      x: number,
      y: number
    }
    form: {
      field_schema: {
        properties: {
          email: {
            Title: string
          }
        }
      }
    }
    isSelected: boolean
    modalOpened: "checkboxGroup" | "object" | "email" | undefined
  }

  type Edge = {
    source: string
    target: string
  }

  type Prefill = {
      isCheckboxGroup: boolean,
      isObject: boolean,
      isEmail: boolean,
      data: string
  }

  const[formData, setFormData] = useState<FormNode[]>()
  const[edges, setEdges] = useState<Edge[]>()
  const[prefillData, setPrefillData] = useState<Prefill>()
  
  useEffect(() => {
    const options = {method: 'GET', headers: {Accept: 'application/json, application/problem+json'}}
    try {
      fetch('http://localhost:3000/api/v1/0/actions/blueprints/0/graph', options)
      .then(res => res.json())
      .then(data => {
        // console.log("inside -data", data)
        // console.log("inside -edges", data.edges)
        setFormData(Array(data.nodes.length)
          .fill({id: "", data: {}, isSelected: false, modalOpened: undefined})
          .map((e, i) => (
            {...data.nodes[i],
              form: (data.forms.find((f: {id: string}) => (f.id === data.nodes[i].data.component_id))),
              isSelected: e.isSelected,
              modalOpened: e.modalOpened}
          ))
        )
        setEdges(data.edges)
      })
    }
    catch (e) {
      console.error(e)
    }
  }, [])
  // console.log("outside -nodeData", formData)
  // console.log("outside -edges", edges)

  // handle nodeClicked
  function toggleNode(id: string) {
    formData ? setFormData(
      formData.map(node => (
        id === node.data.id ? // is this the node that was selected?
        {...node, isSelected: !node.isSelected, modalOpened: undefined} // if so, toggle isSelected and make sure modal is closed
        : {...node, isSelected: false, modalOpened: undefined} // if not, just set all to default
      ))
    ) : null
  }

  // handle prefill clicked
  function prefillClicked(id: string, prefillField: "checkboxGroup" | "object" | "email" | undefined) {
    // console.log("prefilling .. ", prefillField)
    setFormData(formData?.map(e => (
      id === e.data.id ?
      {...e, modalOpened: prefillField} // open modal
      : {...e, isSelected: false, modalOpened: undefined} // make sure all other modals are closed
    )))
  }

  // handle closeModal
  function closeModal() {
    setFormData(formData?.map(e => (
      {...e, modalOpened: undefined} // make sure all modals are closed
    )))
  }

  // handle passPrefillData
  function passPrefillData(node_index: number, type: string) {
    formData ?
    setPrefillData({isCheckboxGroup: type === "checkboxGroup", isObject: type === "object", isEmail: type === "email", data: formData[node_index].data.name})
    : undefined
  }
  console.log(prefillData)

  // get ancestors logic
  function getAncestors(node_id: string): string {
    let s: string = ""
    const node_index = formData ? formData.findIndex(f => node_id === f.id) : -1
    if(!edges) {
      return ""
    } else {
      edges.forEach(e => {
        node_id === e.target ? // am I a target?
        s += `${getAncestors(e.source)},` // find the source, if any
        : null // if none, do nothing
     })
    }
    return s += `${node_index}` // return my ancestors (if any) and myself
  }

  function parseAncestors(ancestors: string): number[] { // string to non-duplicate int array
    let result: number[] = []
    ancestors ? ancestors.split(",").forEach(e => {
      result.find(f => f === parseInt(e)) ? null // if it's already in the array, don't push
      : result.push(parseInt(e)) // push
    }) : undefined
    return result.slice(0, -1) // don't include self as an ancestor
  }

  // console.log(parseAncestors(getAncestors("form-bad163fd-09bd-4710-ad80-245f31b797d5"))) // F
  // console.log(getAncestor("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88")) // A
  // console.log(getAncestor("form-a4750667-d774-40fb-9b0a-44f8539ff6c4")) // B

  return (
    <main>
        <div className="nodelist">
          {formData ? formData.map(e => ( // Node/Data Component
            <Node key={e.data.component_key}
              id={e.data.id}
              type={e.data.component_type}
              name={e.data.name}
              isSelected={e.isSelected}
              nodeClicked={toggleNode} />
          )) : null}
        </div>
        {formData ? formData.map(e => ( // Prefill Component
          <>
            {e.isSelected ? <Prefill key={e.data.component_key}
              id={e.data.id}
              name={e.data.name}
              email={e.data.name}
              prefillClicked={prefillClicked}
              prefillDelivery={prefillData} /> : undefined}
          </>
        )) : null}
        {formData ? formData.map(e => ( // Modal Component
          <>
            {e.modalOpened ? <Modal key={e.data.component_key}
              field={e.modalOpened}
              name={e.data.name}
              ancestorIndicies={parseAncestors(getAncestors(e.id))}
              globalData={{x: 990, y: 989}}
              nodeForm={formData}
              closeModal={closeModal}
              passData={passPrefillData} /> : undefined}
          </>
        )) : null}
    </main>
  )

  /* create a prefill UI component for those forms with the following fields:
  – dynamic checkbox group (no prefill)
  – dynamic object (no prefill)
  – email (prefilled with root's email, include an 'x' button at the end to clear the prefill)
   * specifications:
    – its purpose is to view and edit form prefill mapping
    – clicking an empty field opens a web modal which will display available prefills
  */

  /* create a web modal component that only displays ancestor form data and global data:
   * specifications: hint: will require traversing a directed acyclic graph (DAG)
    – its purpose is to allow the user to select data to prefill the forms in the prefill UI
  */

}

export default App

// D[1] - F[0], E[5] - F[0], B[4] - D[1], A[2] - C[3], A[2] - B[4], C[3] - E[5]
// 
//        A
//       / \
//      B   C
//     /   /
//    D   E
//     \ /
//      F
