import { useRef, useState, type ChangeEvent } from 'react';
import { uploadProfileAvatar } from '../lib/profileAvatar';

export function AvatarPicker({language,onUploaded}:{language:'ru'|'en';onUploaded:(url:string)=>void}){
  const en=language==='en';const cameraRef=useRef<HTMLInputElement>(null);const galleryRef=useRef<HTMLInputElement>(null);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
  const select=async(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;setBusy(true);setMessage('');try{const url=await uploadProfileAvatar(file);onUploaded(url);setMessage(en?'Profile photo saved ✓':'Фото профиля сохранено ✓')}catch(reason){setMessage(reason instanceof Error?reason.message:(en?'Could not save photo.':'Не удалось сохранить фото.'))}finally{setBusy(false)}};
  return <section className="avatar-picker"><strong>{en?'Profile photo':'Фотография профиля'}</strong><div><button disabled={busy} onClick={()=>cameraRef.current?.click()}>📷 {en?'Take a photo':'Сфотографироваться'}</button><button disabled={busy} onClick={()=>galleryRef.current?.click()}>🖼 {en?'Choose from gallery':'Выбрать из галереи'}</button></div><input ref={cameraRef} type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={select}/><input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={select}/>{message&&<small>{message}</small>}</section>;
}
