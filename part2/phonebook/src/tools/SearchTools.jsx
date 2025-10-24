const SearchTools = {
    fuzzySearch(needle, haystack) {
        if (needle.length > haystack.length) {
            return false;
        } else if (needle.length === haystack.length) {
            return needle === haystack;
        }

        outer: for (let i = 0, j = -1; i < needle.length; ++i) {
            const charCode = needle.charCodeAt(i);
            while (++j < haystack.length) {
                if (haystack.charCodeAt(j) === charCode) {
                    continue outer;
                }
            }
            return false;
        }
        return true;
    },
};

export default SearchTools;
