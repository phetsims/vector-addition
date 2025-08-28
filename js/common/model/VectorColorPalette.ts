// Copyright 2019-2025, University of Colorado Boulder

/**
 * Color palette used for rendering vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';


type VectorColorPaletteOptions = {

  // Colors for main vectors (aka parent vectors)
  vectorFillProperty: TReadOnlyProperty<Color | string | null>;
  vectorStrokeProperty?: TReadOnlyProperty<Color | string | null>;

  // Colors for component vectors. They are of type DashedArrowNode, which cannot be stroked.
  // Defaults to options.mainFill
  componentFillProperty?: TReadOnlyProperty<Color | string | null>;

  // Colors for sum vectors
  sumFillProperty: TReadOnlyProperty<Color | string | null>;
  sumStrokeProperty?: TReadOnlyProperty<Color | string | null>;

  // Color for sum component vectors. They are of type DashedArrowNode, which cannot be stroked.
  sumComponentFillProperty?: TReadOnlyProperty<Color | string | null>;

  // Colors for base vectors
  baseVectorFillProperty?: TReadOnlyProperty<Color | string | null>;
  baseVectorStrokeProperty?: TReadOnlyProperty<Color | string | null>;
};

export default class VectorColorPalette {

  public readonly vectorFillProperty: TReadOnlyProperty<Color | string | null>;
  public readonly vectorStrokeProperty: TReadOnlyProperty<Color | string | null>;
  public readonly componentFillProperty: TReadOnlyProperty<Color | string | null>;
  public readonly sumFillProperty: TReadOnlyProperty<Color | string | null>;
  public readonly sumStrokeProperty: TReadOnlyProperty<Color | string | null>;
  public readonly sumComponentFillProperty: TReadOnlyProperty<Color | string | null>;
  public readonly baseVectorFillProperty: TReadOnlyProperty<Color | string | null>;
  public readonly baseVectorStrokeProperty: TReadOnlyProperty<Color | string | null>;

  public constructor( options: VectorColorPaletteOptions ) {

    this.vectorFillProperty = options.vectorFillProperty;
    this.vectorStrokeProperty = ( options.vectorStrokeProperty || new Property( null ) );
    this.componentFillProperty = ( options.componentFillProperty || options.vectorFillProperty );
    this.sumFillProperty = options.sumFillProperty;
    this.sumStrokeProperty = ( options.sumStrokeProperty || new Property( null ) );
    this.sumComponentFillProperty = ( options.sumComponentFillProperty || options.sumFillProperty );
    this.baseVectorFillProperty = ( options.baseVectorFillProperty || new Property<Color>( Color.WHITE ) );
    this.baseVectorStrokeProperty = ( options.baseVectorStrokeProperty || options.vectorFillProperty );
  }
}

vectorAddition.register( 'VectorColorPalette', VectorColorPalette );