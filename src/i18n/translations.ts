export type Language = 'en' | 'vi';

export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.regions': {
    en: 'Regions',
    vi: 'Vùng'
  },
  'nav.compare': {
    en: 'Compare',
    vi: 'So sánh'
  },
  'nav.evolution': {
    en: 'Evolution',
    vi: 'Tiến hóa'
  },
  'nav.favorites': {
    en: 'Favorites',
    vi: 'Yêu thích'
  },
  'nav.allPokemon': {
    en: 'All Pokemon',
    vi: 'Tất cả Pokémon'
  },

  // Evolution Simulator
  'evolution.title': {
    en: 'Pokémon Evolution Simulator',
    vi: 'Mô phỏng tiến hóa Pokémon'
  },
  'evolution.description': {
    en: 'Select a Pokémon and watch its evolution through different stages',
    vi: 'Chọn một Pokémon và xem quá trình tiến hóa của nó qua các giai đoạn'
  },
  'evolution.search': {
    en: 'Search Pokémon (e.g. Bulbasaur, Charmander, ...)',
    vi: 'Tìm Pokémon (VD: Bulbasaur, Charmander, ...)'
  },
  'evolution.searchButton': {
    en: 'Search',
    vi: 'Tìm'
  },
  'evolution.popular': {
    en: 'Popular Pokémon',
    vi: 'Pokémon phổ biến'
  },
  'evolution.simulator': {
    en: 'Evolution Simulator',
    vi: 'Mô phỏng tiến hóa'
  },
  'evolution.noEvolution': {
    en: 'This Pokémon has no evolution stages.',
    vi: 'Pokémon này không có quá trình tiến hóa.'
  },
  'evolution.evolve': {
    en: 'Evolve',
    vi: 'Tiến hóa'
  },
  'evolution.evolving': {
    en: 'Evolving...',
    vi: 'Đang tiến hóa...'
  },
  'evolution.reset': {
    en: 'Reset',
    vi: 'Bắt đầu lại'
  },
  'evolution.stage': {
    en: 'Evolution Stage',
    vi: 'Giai đoạn tiến hóa'
  },
  'evolution.selectPrompt': {
    en: 'Select a Pokémon to start',
    vi: 'Chọn một Pokémon để bắt đầu'
  },
  'evolution.selectDescription': {
    en: 'Search or choose from popular Pokémon above',
    vi: 'Tìm kiếm hoặc chọn từ danh sách Pokémon phổ biến bên trên'
  },
  'evolution.startPrompt': {
    en: 'Choose a Pokémon on the left',
    vi: 'Chọn một Pokémon ở bên trái'
  },
  'evolution.instructions': {
    en: 'Select any Pokémon to visualize its evolution chain in this simulator',
    vi: 'Chọn bất kỳ Pokémon nào để xem chuỗi tiến hóa của nó trong trình mô phỏng này'
  },
  'evolution.method.level': {
    en: 'Evolves at level ${level}',
    vi: 'Tiến hóa ở cấp độ ${level}'
  },
  'evolution.method.happiness': {
    en: 'Evolves at happiness ${value}',
    vi: 'Tiến hóa khi đạt độ thân thiết ${value}'
  },
  'evolution.method.item': {
    en: 'Evolves using ${item}',
    vi: 'Tiến hóa khi sử dụng ${item}'
  },
  'evolution.method.trade': {
    en: 'Evolves when traded',
    vi: 'Tiến hóa khi trao đổi'
  },
  'evolution.method.default': {
    en: 'Evolves when conditions are met',
    vi: 'Tiến hóa khi đạt điều kiện'
  },
  'evolution.fullyEvolved': {
    en: 'Fully Evolved',
    vi: 'Đã tiến hóa hoàn toàn'
  },
  'evolution.fullyEvolvedDesc': {
    en: 'This Pokémon has reached its final evolution stage',
    vi: 'Pokémon này đã đạt đến giai đoạn tiến hóa cuối cùng'
  },
  'evolution.noEvolutionDesc': {
    en: 'This Pokémon does not evolve to or from any other Pokémon',
    vi: 'Pokémon này không tiến hóa từ hoặc thành Pokémon khác'
  },
  'evolution.megaEvolution': {
    en: 'Mega Evolution',
    vi: 'Mega Tiến hóa'
  },
  'evolution.megaEvolutionDesc': {
    en: 'These forms require a Mega Stone and can only be activated during battle',
    vi: 'Các hình thức này yêu cầu Mega Stone và chỉ có thể kích hoạt trong trận đấu'
  },
  'evolution.showMega': {
    en: 'Show Mega Evolution Forms',
    vi: 'Hiển thị hình thức Mega Tiến hóa'
  },
  'evolution.hideMega': {
    en: 'Hide Mega Evolution Forms',
    vi: 'Ẩn hình thức Mega Tiến hóa'
  },
  //Compare Page
  'compare.mightHaveAdvantage': {
    en: 'might have the advantage',
    vi: 'có lợi thế hơn dựa trên tổng chỉ số'
  },
  // Home Page
  'home.title': {
    en: 'Explore the World of Pokémon',
    vi: 'Khám phá thế giới Pokémon'
  },
  'home.description': {
    en: 'Discover and learn about all Pokémon in the Pokédex. Click on any Pokémon to see detailed stats, evolutions, and more!',
    vi: 'Khám phá và tìm hiểu về tất cả Pokémon trong Pokédex. Nhấp vào bất kỳ Pokémon nào để xem chi tiết chỉ số, tiến hóa và nhiều hơn nữa!'
  },
  'home.search.placeholder': {
    en: 'Search Pokémon by name...',
    vi: 'Tìm Pokémon theo tên...'
  },
  'home.search.button': {
    en: 'Search',
    vi: 'Tìm kiếm'
  },
  'home.search.found': {
    en: 'found',
    vi: 'được tìm thấy'
  },
  'home.search.noResults': {
    en: 'No Pokémon match your search',
    vi: 'Không có Pokémon nào phù hợp với tìm kiếm của bạn'
  },
  'home.search.filterDisabled': {
    en: 'Type filters are disabled during search',
    vi: 'Bộ lọc loại bị vô hiệu hóa trong khi tìm kiếm'
  },
  'home.filter.all': {
    en: 'All Types',
    vi: 'Tất cả các loại'
  },
  'home.pagination.prev': {
    en: 'Previous',
    vi: 'Trước'
  },
  'home.pagination.next': {
    en: 'Next',
    vi: 'Tiếp theo'
  },
  'home.pagination.page': {
    en: 'Page',
    vi: 'Trang'
  },
  'home.pagination.of': {
    en: 'of',
    vi: 'trên'
  },
  'home.noResults': {
    en: 'No Pokémon found matching your criteria',
    vi: 'Không tìm thấy Pokémon nào phù hợp với tiêu chí của bạn'
  },
  'home.clearFilters': {
    en: 'Clear Filters',
    vi: 'Xóa bộ lọc'
  },

  // Compare Page
  'compare.title': {
    en: 'Compare Pokémon Stats',
    vi: 'So sánh chỉ số Pokémon'
  },
  'compare.description': {
    en: 'Select two Pokémon to compare their stats and see which one has the advantage in battle.',
    vi: 'Chọn hai Pokémon để so sánh chỉ số và xem Pokémon nào có lợi thế trong trận đấu.'
  },
  'compare.battlePrediction': {
    en: 'Battle Prediction',
    vi: 'Dự đoán trận đấu'
  },
  'compare.selectPokemon1': {
    en: 'Select Pokémon 1',
    vi: 'Chọn Pokémon 1'
  },
  'compare.selectPokemon2': {
    en: 'Select Pokémon 2',
    vi: 'Chọn Pokémon 2'
  },
  'compare.searchPlaceholder': {
    en: 'Search Pokémon...',
    vi: 'Tìm kiếm Pokémon...'
  },
  'compare.loading': {
    en: 'Loading...',
    vi: 'Đang tải...'
  },
  'compare.noResults': {
    en: 'No Pokémon found',
    vi: 'Không tìm thấy Pokémon'
  },
  'compare.chartTitle': {
    en: 'Stats Comparison Chart',
    vi: 'Biểu đồ so sánh chỉ số'
  },
  'compare.selectAtLeastOne': {
    en: 'Select at least one Pokémon to view stats',
    vi: 'Chọn ít nhất một Pokémon để xem chỉ số'
  },
  'compare.stats.hp': {
    en: 'HP',
    vi: 'HP'
  },
  'compare.stats.attack': {
    en: 'Attack',
    vi: 'Tấn công'
  },
  'compare.stats.defense': {
    en: 'Defense',
    vi: 'Phòng thủ'
  },
  'compare.stats.specialAttack': {
    en: 'Special Attack',
    vi: 'Tấn công đặc biệt'
  },
  'compare.stats.specialDefense': {
    en: 'Special Defense',
    vi: 'Phòng thủ đặc biệt'
  },
  'compare.stats.speed': {
    en: 'Speed',
    vi: 'Tốc độ'
  },
  'compare.stats.total': {
    en: 'Total Stats',
    vi: 'Tổng chỉ số'
  },
  'compare.otherInfo': {
    en: 'Other Information',
    vi: 'Thông tin khác'
  },
  'compare.attributes.type': {
    en: 'Type',
    vi: 'Loại'
  },
  'compare.attributes.height': {
    en: 'Height',
    vi: 'Chiều cao'
  },
  'compare.attributes.weight': {
    en: 'Weight',
    vi: 'Cân nặng'
  },
  'compare.attributes.abilities': {
    en: 'Abilities',
    vi: 'Khả năng'
  },

  // Pokemon Details
  'pokemon.stats': {
    en: 'Stats',
    vi: 'Chỉ số'
  },
  'pokemon.abilities': {
    en: 'Abilities',
    vi: 'Khả năng'
  },
  'pokemon.evolution': {
    en: 'Evolution',
    vi: 'Tiến hóa'
  },
  'pokemon.weight': {
    en: 'Weight',
    vi: 'Cân nặng'
  },
  'pokemon.height': {
    en: 'Height',
    vi: 'Chiều cao'
  },
  'pokemon.baseStats': {
    en: 'Base Stats',
    vi: 'Chỉ số cơ bản'
  },
  'pokemon.evolutionChain': {
    en: 'Evolution Chain',
    vi: 'Chuỗi tiến hóa'
  },
  'pokemon.hiddenAbility': {
    en: 'Hidden',
    vi: 'Ẩn'
  },
  'pokemon.standardAbility': {
    en: 'This is a standard ability for this Pokémon.',
    vi: 'Đây là khả năng chuẩn của Pokémon này.'
  },
  'pokemon.hiddenAbilityDesc': {
    en: 'This is a hidden ability that Pokémon can have.',
    vi: 'Đây là khả năng ẩn mà Pokémon có thể có.'
  },
  'pokemon.addToFavorites': {
    en: 'Add to Favorites',
    vi: 'Thêm vào yêu thích'
  },
  'pokemon.removeFromFavorites': {
    en: 'Remove from Favorites',
    vi: 'Xóa khỏi yêu thích'
  },

  // Favorites
  'favorites.title': {
    en: 'Favorite Pokémon',
    vi: 'Pokémon yêu thích'
  },
  'favorites.description': {
    en: 'Your collection of favorite Pokémon',
    vi: 'Bộ sưu tập Pokémon yêu thích của bạn'
  },
  'favorites.empty': {
    en: 'You have no favorite Pokémon yet',
    vi: 'Bạn chưa có Pokémon yêu thích nào'
  },
  'favorites.addSome': {
    en: 'Browse Pokémon and click the heart icon to add them to your favorites',
    vi: 'Duyệt Pokémon và nhấp vào biểu tượng trái tim để thêm vào yêu thích'
  },
  'favorites.browseButton': {
    en: 'Browse Pokémon',
    vi: 'Duyệt Pokémon'
  },

  // Regions
  'regions.title': {
    en: 'Pokémon Regions',
    vi: 'Vùng Pokémon'
  },
  'regions.description': {
    en: 'Explore the various regions in the Pokémon world',
    vi: 'Khám phá các vùng khác nhau trong thế giới Pokémon'
  },
  'regions.explore': {
    en: 'Explore Region',
    vi: 'Khám phá vùng'
  },
  'regions.noRegions': {
    en: 'No regions found. Please try again later.',
    vi: 'Không tìm thấy vùng nào. Vui lòng thử lại sau.'
  },
  'regions.loading': {
    en: 'Loading regions...',
    vi: 'Đang tải vùng...'
  },
  'regions.loadingError': {
    en: 'Error Loading Regions',
    vi: 'Lỗi khi tải vùng'
  },
  'regions.locations': {
    en: 'Locations',
    vi: 'Địa điểm'
  },
  'regions.knownRegions': {
    en: 'Known Regions',
    vi: 'Vùng đã biết'
  },
  'regions.noRegionsDescription': {
    en: 'No regions have been discovered yet. Check back again later.',
    vi: 'Chưa có vùng nào được khám phá. Vui lòng quay lại sau.'
  },
  'regions.locationCount': {
    en: '${count} Locations',
    vi: '${count} địa điểm'
  },
  'regions.generation': {
    en: 'Generation',
    vi: 'Thế hệ'
  },
  'regions.description.detail': {
    en: 'The ${name} region is a land of adventure and discovery. Trainers from all over come to explore its varied environments and challenge its Gym Leaders.',
    vi: 'Vùng ${name} là một vùng đất của phiêu lưu và khám phá. Huấn luyện viên từ khắp nơi đến để khám phá môi trường đa dạng và thách đấu các Nhà thi đấu.'
  },
  'regions.locationsIn': {
    en: 'Locations in ${name}',
    vi: 'Địa điểm ở ${name}'
  },
  'regions.noLocations': {
    en: 'No locations found in this region.',
    vi: 'Không tìm thấy địa điểm nào trong vùng này.'
  },

  // Locations
  'location.areas': {
    en: 'Area',
    vi: 'Khu vực'
  },
  'location.areaPlural': {
    en: 'Areas',
    vi: 'Khu vực'
  },
  'location.viewDetails': {
    en: 'View Details',
    vi: 'Xem chi tiết'
  },
  'location.loading': {
    en: 'Loading location details...',
    vi: 'Đang tải thông tin địa điểm...'
  },
  'location.description': {
    en: '${name} is a location in the ${region} region. It features various areas where Pokémon can be encountered.',
    vi: '${name} là một địa điểm ở vùng ${region}. Nó có các khu vực khác nhau nơi có thể gặp Pokémon.'
  },
  'location.encounters': {
    en: 'Pokémon Encounters in ${name}',
    vi: 'Gặp gỡ Pokémon ở ${name}'
  },
  'location.searchPokemon': {
    en: 'Search Pokémon...',
    vi: 'Tìm Pokémon...'
  },
  'location.noPokemonFound': {
    en: 'No Pokémon found matching "${term}"',
    vi: 'Không tìm thấy Pokémon nào khớp với "${term}"'
  },
  'location.version': {
    en: 'Version',
    vi: 'Phiên bản'
  },
  'location.level': {
    en: 'Level',
    vi: 'Cấp độ'
  },
  'location.chance': {
    en: 'Chance',
    vi: 'Tỷ lệ'
  },
  'location.method': {
    en: 'Method',
    vi: 'Phương pháp'
  },
  'location.encounterDetails': {
    en: 'Encounter Details',
    vi: 'Chi tiết gặp gỡ'
  },
  'location.noEncounters': {
    en: 'No Encounters Found',
    vi: 'Không tìm thấy gặp gỡ nào'
  },
  'location.noEncountersDescription': {
    en: 'No Pokémon encounters are recorded for this location area.',
    vi: 'Không có ghi nhận gặp gỡ Pokémon nào trong khu vực địa điểm này.'
  },

  // Common UI
  'ui.loading': {
    en: 'Loading...',
    vi: 'Đang tải...'
  },
  'ui.tryAgain': {
    en: 'Try Again',
    vi: 'Thử lại'
  },
  'ui.back': {
    en: 'Back',
    vi: 'Quay lại'
  },
  'ui.error': {
    en: 'Error',
    vi: 'Lỗi'
  },
  'ui.loadingError': {
    en: 'Could not load Pokémon information. Please try again.',
    vi: 'Không thể tải thông tin Pokémon. Vui lòng thử lại.'
  },
  'ui.goBack': {
    en: 'Go Back',
    vi: 'Quay lại'
  },
  'ui.loadingPokemon': {
    en: 'Loading Pokémon...',
    vi: 'Đang tải Pokémon...'
  },
  'ui.loadingPokemonError': {
    en: 'Error Loading Pokémon',
    vi: 'Lỗi khi tải Pokémon'
  },
  'ui.footer.description': {
    en: 'Explore the world of Pokemon',
    vi: 'Khám phá thế giới Pokémon'
  },
  'ui.footer.credit': {
    en: 'Data provided by',
    vi: 'Dữ liệu được cung cấp bởi'
  },
  'ui.footer.rights': {
    en: 'All rights reserved.',
    vi: 'Đã đăng ký bản quyền.'
  },

  // Language Switcher
  'language.en': {
    en: 'English',
    vi: 'Tiếng Anh'
  },
  'language.vi': {
    en: 'Vietnamese',
    vi: 'Tiếng Việt'
  },
  'language.switch': {
    en: 'Switch language',
    vi: 'Đổi ngôn ngữ'
  },

  // Error messages
  'error.loading': {
    en: 'Error Loading Pokémon',
    vi: 'Lỗi Khi Tải Pokémon'
  },
  'error.tryAgain': {
    en: 'Try Again',
    vi: 'Thử Lại'
  }
};