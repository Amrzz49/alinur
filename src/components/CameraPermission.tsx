import { useState } from 'react';

type Props={enabled:boolean;language:'ru'|'en';onChange:(enabled:boolean)=>void};

export function CameraPermission({enabled,language,onChange}:Props){
  const en=language==='en';const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const allow=async()=>{setBusy(true);setError('');try{const stream=await navigator.mediaDevices.getUserMedia({video:true});stream.getTracks().forEach((track)=>track.stop());onChange(true)}catch{onChange(false);setError(en?'Camera access was not granted.':'Доступ к камере не предоставлен.')}finally{setBusy(false)}};
  return <section className="camera-permission"><span>📷</span><div><strong>{en?"We'll only use your camera to scan documents when you choose to.":'Мы используем камеру для сканирования документов, только когда ты сам этого захочешь.'}</strong><small>{enabled?(en?'Camera access is enabled.':'Доступ к камере включён.'):(en?'Camera access is optional.':'Доступ к камере необязателен.')}</small>{error&&<em>{error}</em>}<div><button disabled={busy} onClick={allow}>{busy?(en?'Waiting…':'Ожидаем…'):(en?'Allow camera':'Разрешить камеру')}</button><button onClick={()=>onChange(false)}>{en?'Not now':'Не сейчас'}</button></div></div></section>;
}
