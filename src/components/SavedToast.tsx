export function SavedToast({language}:{language:'ru'|'en'}){
  return <div className="saved-toast" role="status"><span>✓</span>{language==='en'?'Awesome! Your changes have been saved.':'Отлично! Твои изменения сохранены.'}</div>;
}
