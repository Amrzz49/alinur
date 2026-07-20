import { supabase } from './supabase';

export async function uploadProfileAvatar(file:File):Promise<string>{
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Поддерживаются JPG, PNG и WEBP.');
  if(file.size>5*1024*1024)throw new Error('Фотография должна быть меньше 5 МБ.');
  const {data:auth}=await supabase.auth.getUser();if(!auth.user)throw new Error('Войди в аккаунт, чтобы сохранить фото.');
  const path=`${auth.user.id}/avatar`;
  const {error}=await supabase.storage.from('avatars').upload(path,file,{upsert:true,contentType:file.type,cacheControl:'0'});
  if(error)throw error;
  const {data}=supabase.storage.from('avatars').getPublicUrl(path);
  const avatarUrl=`${data.publicUrl}?v=${Date.now()}`;
  const {error:updateError}=await supabase.auth.updateUser({data:{avatar_url:avatarUrl}});
  if(updateError)throw updateError;
  return avatarUrl;
}
