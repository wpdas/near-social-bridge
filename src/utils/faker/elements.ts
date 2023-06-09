const names = [
  'Wenderson',
  'Dayane',
  'Pires',
  'Gandos',
  'Silva',
  'Katrina',
  'Cate',
  'Rivers',
  'Michael',
  'Fernanda',
  'Ketlin',
  'Hannah',
  'Abdul',
  'Lima',
  'Tamara',
  'Barbara',
  'Martins',
  'Olivia',
  'Santos',
  'Beatriz',
  'Nascimento',
  'Willian',
  'Pietro',
  'Cruzeiro',
  'Adelle',
  'Espinosa',
  'Stefanny',
  'Cole',
  'Etinosa',
  'Eljay',
  'Lennon',
  'Majid',
  'Lucien',
  'Noor',
  'Nico',
  'Shaarvin',
  'Seamas',
  'Samy',
  'Windsor',
  'Sheigh',
  'Hector',
  'Uzayr',
  'Zidane',
  'Ijay',
  'Graham',
  'Aleksandrs',
  'Baxter',
  'Scot',
  'Morton',
  'Tibet',
]

export const randName = () => {
  const index = Math.max(0, Math.floor(Math.random() * names.length - 1))
  return names[index]
}

export const randUserName = (firstName: string, lastName: string) => `${firstName}${lastName}`

export const loremIpsum =
  'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.'
