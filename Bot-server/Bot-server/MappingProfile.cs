
    using AutoMapper;
    using Bot_server.Models;
    using Bot_server.DTOs;

public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ImageDTO, Image>()
                .ForMember(dest => dest.Commands, opt => opt.MapFrom(src => src.Commands));

            CreateMap<DrawingDTO, Drawing>().ReverseMap();

            // אם יש צורך, גם הפוך:
            CreateMap<Image, ImageDTO>();
        CreateMap<Image, Images>();

    }
}


