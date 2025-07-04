type Input = {
    field: "checkboxGroup" | "object" | "email" | undefined,
    name: string,
    ancestorIndicies: number[]
    globalData: {
      x: number,
      y: number
    }
    nodeForm: NodeForm[]
    closeModal: Function
    passData: Function
}

type NodeForm = {
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

export default function modal(props: Input) {
    // console.log(props.nodeForm)
    // console.log(props)
    return (
        <>
            <div>{props.field}</div>
            <dialog id="modal" open={true}>
                <p>Modal for {props.name}</p>
                <div onClick={() => props.passData(-1)}>Global data (X: {props.globalData.x}, Z: {props.globalData.y})</div>
                {props.ancestorIndicies.length ? props.ancestorIndicies.map((e) => {
                  // console.log(props.nodeForm[e].position)
                  return <div onClick={() => props.passData(e, props.field)}>{props.nodeForm[e].data.name} (X: {props.nodeForm[e].position.x}, Y: {props.nodeForm[e].position.y})</div>
                }) : <div>no ancestors!</div>}
                <button id="close-modal" onClick={() => props.closeModal()}>Close this modal</button>
            </dialog>
        </>
    )
}
