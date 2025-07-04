type Form = {
    id: string
    name: string
    email: string
    prefillClicked: Function
    prefillDelivery: {
        isCheckboxGroup: boolean,
        isObject: boolean,
        isEmail: boolean,
        data: string
    } | undefined
}

function clearEmail(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    (document.querySelector('#theEmail') as HTMLInputElement).value = ""
    e.preventDefault()
}

export default function prefill(props: Form) {
    return (
        <form className="prefill"
        >Prefill for {props.name[props.name.length - 1]}
            <input type="text" placeholder="dynamic_checkbox_group" value={props.prefillDelivery?.isCheckboxGroup ? props.prefillDelivery.data : undefined} onClick={
                e => e.currentTarget.value ? undefined : props.prefillClicked(props.id, "checkboxGroup")
                } />
            <input type="text" placeholder="dynamic_object" value={props.prefillDelivery?.isObject ? props.prefillDelivery.data : undefined} onClick={
                e => e.currentTarget.value ? undefined : props.prefillClicked(props.id, "object")
                } />
            <div className="email-wrapper">
                <input id="theEmail" type="text" placeholder="email@website.com" defaultValue={`email: ${props.email}.email`} value={props.prefillDelivery?.isEmail ? `email.${props.prefillDelivery.data}` : undefined} onClick={
                e => e.currentTarget.value ? undefined : props.prefillClicked(props.id, "email")
                } />
                <button className="clear-email" onClick={clearEmail}>x</button>
            </div>
        </form>
    )
}
