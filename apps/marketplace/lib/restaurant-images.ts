// Restaurant hero images — real photos from DoorDash and Yelp

export const restaurantImages: Record<string, { hero: string; gradient: string }> = {
  'la-viga': {
    hero: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/1950.jpg',
    gradient: 'from-amber-900/80 to-red-900/80',
  },
  'mazra': {
    hero: 'https://s3-media0.fl.yelpcdn.com/bphoto/pOoLG6o7gkyHJB9A91Ct4A/l.jpg',
    gradient: 'from-orange-900/80 to-amber-900/80',
  },
  'nomadic-kitchen': {
    hero: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/a9992a71-3170-4ea6-bf02-f5cd4656a684.jpg',
    gradient: 'from-red-900/80 to-orange-900/80',
  },
  'vesta': {
    hero: 'https://s3-media0.fl.yelpcdn.com/bphoto/8wNIwFvsQvBAuFFHmBuxQQ/l.jpg',
    gradient: 'from-red-800/80 to-yellow-900/80',
  },
  'timber-and-salt': {
    hero: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/7a9eafb6-1af5-4b8c-9378-618465e4ddf8.png',
    gradient: 'from-stone-900/80 to-amber-900/80',
  },
  'donato-enoteca': {
    hero: 'https://s3-media0.fl.yelpcdn.com/bphoto/lNvuWIdvKX9L_WVv72lPnw/l.jpg',
    gradient: 'from-emerald-900/80 to-stone-900/80',
  },
  'angelicas': {
    hero: 'https://s3-media0.fl.yelpcdn.com/bphoto/fEy2-1fijVUUKDErSvtsNg/l.jpg',
    gradient: 'from-rose-900/80 to-purple-900/80',
  },
  'broadway-masala': {
    hero: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/1951.jpg',
    gradient: 'from-yellow-900/80 to-red-900/80',
  },
  'hurrica': {
    hero: 'https://s3-media0.fl.yelpcdn.com/bphoto/3JwbOBvzDM4WjILvP4kjrg/l.jpg',
    gradient: 'from-blue-900/80 to-slate-900/80',
  },
  'pamilya': {
    hero: 'https://s3-media0.fl.yelpcdn.com/bphoto/XcLFOiOu5jWjZR5K2afydA/l.jpg',
    gradient: 'from-amber-800/80 to-orange-900/80',
  },
  'la-fonda': {
    hero: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/ebb44116-2a75-473b-9a52-996ae6c4c4a3.jpg',
    gradient: 'from-red-900/80 to-amber-900/80',
  },
  'pizzeria-cardamomo': {
    hero: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/76365958-b0e2-4dcd-b046-e7608bf4dced.JPG',
    gradient: 'from-red-800/80 to-orange-900/80',
  },
  'mistral': {
    hero: 'https://s3-media0.fl.yelpcdn.com/bphoto/ixvDsg__CM789RfjhjIbPQ/l.jpg',
    gradient: 'from-slate-900/80 to-blue-900/80',
  },
  'bao': {
    hero: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/2f2eb967-9d76-42c0-bf59-2093c99b172d.jpg',
    gradient: 'from-red-900/80 to-stone-900/80',
  },
  'limon': {
    hero: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/4c6112e3-eea2-4dd8-98e8-79c0fdd16898.jpg',
    gradient: 'from-lime-900/80 to-emerald-900/80',
  },
};

// Cuisine-specific fallback images for generic cards
export const cuisineImages: Record<string, string> = {
  'Mexican': 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&q=80&fit=crop',
  'Seafood': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80&fit=crop',
  'Mediterranean': 'https://images.unsplash.com/photo-1540914124281-342587941389?w=400&q=80&fit=crop',
  'BBQ': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80&fit=crop',
  'Turkish': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80&fit=crop',
  'Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80&fit=crop',
  'Italian': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80&fit=crop',
  'American': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
  'Steaks': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
  'Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80&fit=crop',
  'California': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80&fit=crop',
  'Latin': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80&fit=crop',
  'Filipino': 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400&q=80&fit=crop',
  'Chinese': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80&fit=crop',
  'Dim Sum': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80&fit=crop',
  'Peruvian': 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400&q=80&fit=crop',
  'Fine Dining': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&fit=crop',
  'Wine Bar': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80&fit=crop',
};

export function getRestaurantImage(slug: string) {
  return restaurantImages[slug] || {
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&fit=crop',
    gradient: 'from-gray-900/80 to-gray-800/80',
  };
}
