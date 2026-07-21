type Props={kind:'loading'|'error';title:string;text?:string;action?:string;onAction?:()=>void};

export function StatusState({kind,title,text,action,onAction}:Props){
  return <section className={`status-state status-state--${kind}`} role={kind==='error'?'alert':'status'}>
    <span>{kind==='loading'?<i/>:'!'}</span><h2>{title}</h2>{text&&<p>{text}</p>}
    {action&&onAction&&<button onClick={onAction}>{action}</button>}
  </section>;
}
